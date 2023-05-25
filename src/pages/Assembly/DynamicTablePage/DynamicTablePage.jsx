/* eslint-disable react/prop-types */
/* eslint-disable react/jsx-key */
import React from "react";
import { useParams } from "react-router-dom";
import { useSortBy, useTable } from "react-table";
import update from "immutability-helper";
import { HTML5Backend } from "react-dnd-html5-backend";
import { DndProvider, useDrag, useDrop } from "react-dnd";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import {
  HiOutlineDownload,
  HiOutlineSave,
  HiOutlineSaveAs,
  HiOutlineUpload,
  HiTrash,
} from "react-icons/hi";
import Titlebar from "../../../Shared/Titlebar";
import axios from "axios";
import Swal from "sweetalert2";
import { API_URL } from "../../../constants";
import { useEffect } from "react";
import { useCallback } from "react";
import { MoonLoader } from "react-spinners";
const DND_ITEM_TYPE = "row";

const EditableCell = ({
  value: initialValue,
  row: { index },
  column: { id },
  updateMyData, // This is a custom function that we supplied to our table instance
}) => {
  // We need to keep and update the state of the cell normally
  const [value, setValue] = React.useState(initialValue);

  const onChange = (e) => {
    setValue(e.target.value);
  };

  // We'll only update the external data when the input is blurred
  const onBlur = () => {
    updateMyData(index, id, value);
  };

  // If the initialValue is changed external, sync it up with our state
  React.useEffect(() => {
    setValue(initialValue);
  }, [initialValue]);

  return <input value={value} onChange={onChange} onBlur={onBlur} />;
};

// Set our editable cell renderer as the default Cell renderer
const defaultColumn = {
  Cell: EditableCell,
};

const Row = ({ row, index, moveRow, deleteRow }) => {
  const dropRef = React.useRef(null);
  const dragRef = React.useRef(null);

  const [, drop] = useDrop({
    accept: DND_ITEM_TYPE,
    hover(item, monitor) {
      if (!dropRef.current) {
        return;
      }
      const dragIndex = item.index;
      const hoverIndex = index;
      // Don't replace items with themselves
      if (dragIndex === hoverIndex) {
        return;
      }
      // Determine rectangle on screen
      const hoverBoundingRect = dropRef.current.getBoundingClientRect();
      // Get vertical middle
      const hoverMiddleY =
        (hoverBoundingRect.bottom - hoverBoundingRect.top) / 2;
      // Determine mouse position
      const clientOffset = monitor.getClientOffset();
      // Get pixels to the top
      const hoverClientY = clientOffset.y - hoverBoundingRect.top;
      // Only perform the move when the mouse has crossed half of the items height
      // When dragging downwards, only move when the cursor is below 50%
      // When dragging upwards, only move when the cursor is above 50%
      // Dragging downwards
      if (dragIndex < hoverIndex && hoverClientY < hoverMiddleY) {
        return;
      }
      // Dragging upwards
      if (dragIndex > hoverIndex && hoverClientY > hoverMiddleY) {
        return;
      }
      // Time to actually perform the action
      moveRow(dragIndex, hoverIndex);
      // Note: we're mutating the monitor item here!
      // Generally it's better to avoid mutations,
      // but it's good here for the sake of performance
      // to avoid expensive index searches.
      item.index = hoverIndex;
    },
  });

  const [{ isDragging }, drag, preview] = useDrag({
    type: DND_ITEM_TYPE,
    item: { type: DND_ITEM_TYPE, index },
    collect: (monitor) => ({
      isDragging: monitor.isDragging(),
    }),
  });

  const opacity = isDragging ? 0 : 1;

  preview(drop(dropRef));
  drag(dragRef);

  return (
    <tr
      className="w-full border-solid border-2"
      ref={dropRef}
      style={{ opacity }}
    >
      <td ref={dragRef}>::</td>
      {row.cells.map((cell) => {
        return (
          <td className="py-3" {...cell.getCellProps()}>
            {cell.render("Cell")}
          </td>
        );
      })}
      <td>
        <button
          className="bg-[#6B59CC] text-white px-3 mr-2 py-2 rounded-lg"
          onClick={() => {
            deleteRow(row.original.id);
          }}
        >
          <HiTrash />
        </button>
      </td>
    </tr>
  );
};

const DynamicTablePage = () => {
  const { id } = useParams();
  const [isLoading, setLoading] = React.useState(true);
  const [data, setData] = React.useState([]);
  const [isUploading, setIsUploading] = React.useState(false);
  const columns = React.useMemo(
    () => [
      {
        Header: "Name",
        accessor: "name",
      },
      {
        Header: "Spend",
        accessor: "spend",
      },
      {
        Header: "Clicks",
        accessor: "clicks",
      },
      {
        Header: "Metric1",
        accessor: "metric1",
      },
      {
        Header: "Metric2",
        accessor: "metric2",
      },
    ],
    []
  );
  const moveRow = (dragIndex, hoverIndex) => {
    const dragRecord = data[dragIndex];
    setData(
      update(data, {
        $splice: [
          [dragIndex, 1],
          [hoverIndex, 0, dragRecord],
        ],
      })
    );
  };

  const deleteRow = (id) => {
    setData(data.filter((row) => row.id !== id));
  };

  const updateMyData = (rowIndex, columnId, value) => {
    // We also turn on the flag to not reset the page
    setData((old) =>
      old.map((row, index) => {
        if (index === rowIndex) {
          return {
            ...old[rowIndex],
            [columnId]: value,
          };
        }
        return row;
      })
    );
  };

  const { getTableBodyProps, getTableProps, headerGroups, rows, prepareRow } =
    useTable(
      {
        columns,
        data,
        defaultColumn,
        updateMyData,
      },
      useSortBy
    );

  const getData = useCallback(async () => {
    try {
      setLoading(true);
      const resp = await axios.get(`${API_URL}/getData/${id}`);
      const { data: respData } = resp;
      if (respData) {
        setData(respData.data.statements);
      }
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  }, [id]);

  const handleDownloadFile = useCallback(async () => {
    try {
      const resp = await axios.get(`${API_URL}/download/${id}`, {
        responseType: "blob",

        headers: {
          Accept: "application/vnd.ms-excel",
        },
      });
      const blob = new Blob([resp.data], {
        type: "application/vnd.ms-excel",
      });
      const link = document.createElement("a");
      link.href = window.URL.createObjectURL(blob);
      link.download = "data.xlsx";
      link.click();
    } catch (error) {
      console.log(error);
    }
  }, [id]);

  const autoUpdateData = useCallback(async () => {
    if (isUploading && data.length !== 0) {
      return;
    }
    try {
      const _data = {
        id: id,
        statements: data,
      };
      console.log("data-to-be-saved", _data);
      const resp = await axios.put(`${API_URL}/update/${id}`, _data);
      toast.success("💾 Saved successfully!");
      console.log(resp);
    } catch (error) {
      console.log(error);
    }
  }, [data, id, isUploading]);

  const uploadFile = async (e) => {
    setIsUploading(true);
    const file = e.target.files[0];
    const formData = new FormData();
    formData.append("sheet", file);
    formData.append("id", id);
    try {
      Swal.fire({
        title: "Uploading...",
        allowOutsideClick: false,
        didOpen: () => {
          Swal.showLoading();
        },
      });
      const res = await axios.post(`${API_URL}/store`, formData);
      window.location.reload();
      console.log(res);
      Swal.close();
    } catch (error) {
      console.log(error);
    } finally {
      setIsUploading(false);
    }
  };

  useEffect(() => {
    getData();
  }, [getData]);

  useEffect(() => {
    const interval = setInterval(() => {
      autoUpdateData();
    }, 500000);
    return () => clearInterval(interval);
  }, [autoUpdateData]);

  return (
    <>
      <div>
        <Titlebar title={id} />
        <div className="flex gap-2 items-center my-5">
          <label
            htmlFor="uploadFile"
            className="bg-[#A0C6F2] gap-3 text-black cursor-pointer p-2 transition-all rounded-xl flex items-center w-fit"
          >
            <HiOutlineUpload />
            Upload File
          </label>
          <input
            type="file"
            onChange={(e) => {
              uploadFile(e);
              e.target.value = null;
            }}
            id="uploadFile"
            hidden
          />
          <button
            onClick={() => handleDownloadFile()}
            className="bg-[#A0C6F2] gap-3 text-black cursor-pointer p-2 transition-all rounded-xl flex items-center w-fit"
          >
            <HiOutlineDownload />
            Download File
          </button>
          <button
            onClick={() => autoUpdateData()}
            className="bg-[#A4D0A4] gap-3 text-black cursor-pointer p-2 transition-all rounded-xl flex items-center w-fit"
          >
            <HiOutlineSaveAs />
            Save
          </button>
        </div>
        {isLoading && (
          <div className="flex flex-col gap-2 justify-center items-center">
            <MoonLoader></MoonLoader>
            <p>
              <span className="ml-2">Loading...</span>
            </p>
          </div>
        )}
        {!isLoading && data.length === 0 && (
          <div className="flex flex-col gap-2 justify-center items-center">
            <h1 className="text-2xl">No Data found</h1>
            <p>Please upload file to manipulate data....</p>

            <label
              htmlFor="uploadFile"
              className="bg-[#A0C6F2] gap-3 text-black cursor-pointer p-2 transition-all rounded-xl flex items-center w-fit"
            >
              <HiOutlineUpload />
              Upload File
            </label>
            <input
              type="file"
              onChange={(e) => {
                uploadFile(e);
                e.target.value = null;
              }}
              id="uploadFile"
              hidden
            />
          </div>
        )}

        {!isLoading && data.length !== 0 && (
          <DndProvider backend={HTML5Backend}>
            <table className="border-solid border-2" {...getTableProps()}>
              <thead className="w-full border-solid border-2">
                {headerGroups.map((headerGroup) => (
                  <tr {...headerGroup.getHeaderGroupProps()}>
                    <th className="w-10 text-left">::</th>
                    {headerGroup.headers.map((column) => (
                      <th
                        className="text-left py-3"
                        {...column.getHeaderProps(
                          column.getSortByToggleProps()
                        )}
                      >
                        {column.render("Header")}
                        <span>
                          {column.isSorted
                            ? column.isSortedDesc
                              ? " 🔽"
                              : " 🔼"
                            : ""}
                        </span>
                      </th>
                    ))}
                  </tr>
                ))}
              </thead>
              <tbody {...getTableBodyProps()}>
                {rows.map((row, index) => {
                  prepareRow(row);
                  return (
                    <Row
                      index={index}
                      row={row}
                      deleteRow={deleteRow}
                      moveRow={moveRow}
                      {...row.getRowProps()}
                    />
                  );
                })}
              </tbody>
            </table>
          </DndProvider>
        )}
      </div>
      <ToastContainer theme="dark" autoClose={3000} />
    </>
  );
};

export default DynamicTablePage;
