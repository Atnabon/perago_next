"use client";

import { useForm } from "react-hook-form";
import { usePosition } from "@/context/PositionContext.js";
import PositionTree from "./PositionsTree";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import { useState, useEffect } from "react";
import Alert from "@mui/material/Alert";
import useSWR, { mutate } from "swr";
import axios from "axios";

const theme = createTheme();

export default function Positions() {
  const {
    positions,
    status,
    error,
    selectedPosition,
    addPosition,
    updatePosition,
    deletePosition,
  } = usePosition();
  const { register, handleSubmit, reset, formState } = useForm();
  const [formCreated, setFormCreated] = useState(false);
  const [positionNames, setPositionNames] = useState([]);
  const [positionIds, setPositionIds] = useState([]);
  const [parentId, setParentId] = useState(null);
  const [formData, setFormData] = useState({
    parentId: null, 
  });

  const handleAddPosition = async (data) => {
    console.log("the data:", data);
    try {
      await addPosition(data);
      reset();
      setFormCreated(true);
      mutate("/api/positions"); 
    } catch (error) {
      console.error(error);
    }
  };

  const handleUpdatePosition = async (data) => {
    try {
      await updatePosition({ ...data, id: selectedPosition?.id });
      SelectedPosition(null);
      reset();
      mutate("/api/positions"); 
    } catch (error) {
      console.error(error);
    }
  };

  const handleDeletePosition = async () => {
    if (selectedPosition) {
      await deletePosition(selectedPosition.id);
      SelectedPosition(null);
      mutate("/api/positions"); 
    }
  };

  const handleSubmitForm = (data) => {
    if (selectedPosition) {
      handleUpdatePosition(data);
    } else {
      handleAddPosition(data);
    }
  };

  const { data, error: fetchError } = useSWR("/api/positions", fetchPositions, {
    initialData: positions,
  });

  useEffect(() => {
    if (data) {
      const positionName = data.map((item) => item.name);
      const positionId = data.map((item) => item._id);
      setPositionIds(positionId);
      setPositionNames(positionName);
    }
  }, [data]);

  const handleParentChange = (event) => {
    const selectedParentId = event.target.value;
    console.log("id:", selectedParentId);
    setParentId(selectedParentId);
    setFormData({
      ...formData,
      parentId: selectedParentId,
    });
  };

  return (
    <div className="flex flex-col h-screen">
      {formCreated && (
        <Alert severity="success" style={{ margin: "auto" }}>
          Position Created Successfully!
        </Alert>
      )}
      <div className="overflow-y-auto">
        <ThemeProvider theme={theme}>
          <PositionTree />
        </ThemeProvider>
      </div>
      <div className="px-4 py-2 bg-gray-100 md:w-1/2 lg:w-3/4 xl:w-3/4">
        <form onSubmit={handleSubmit(handleSubmitForm)} className="space-y-4">
          <input
            type="hidden"
            
          />
          <div>
            <label
              htmlFor="name"
              className="block text-gray-700 font-bold mb-2"
            >
              Position Name
            </label>
            <input
              type="text"
              {...register("name", { required: true })}
              className="w-full px-3 py-2 leading-tight border rounded"
            />
            {formState.errors.name && (
              <p className="mt-1 text-sm text-red-500">Name is required</p>
            )}
          </div>
          <div>
            <label
              htmlFor="description"
              className="block text-gray-700 font-bold mb-2"
            >
              Description
            </label>
            <input
              type="text"
              {...register("description", { required: true })}
              className="w-full px-3 py-2 leading-tight border rounded"
            />
            {formState.errors.description && (
              <p className="mt-1 text-sm text-red-500">
                Description is required
              </p>
            )}
          </div>
          <div>
            <label
              htmlFor="parentId"
              className="block text-gray-700 font-bold mb-2"
            >
              Parent Position
            </label>
            <select
              {...register("parentId")}
              className="w-full px-3 py-2 leading-tight border rounded"
              onChange={handleParentChange}
              value={parentId}
            >
              <option key="" value={null}>
                NONE
              </option>
              {positionNames.map((position, index) => {
                return (
                  <option key={position} value={positionIds[index]}>
                    {position}
                  </option>
                );
              })}
            </select>
          </div>
          <div className="flex justify-end">
            <button
              type="submit"
              className="px-4 py-2 font-bold text-white bg-gradient-to-r from-blue-400 to-green-500 rounded hover:bg-green-700 shadow-md"
            >
              {selectedPosition ? "Update" : "Add Position"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

async function fetchPositions() {
  const response = await axios.get("/api/positions");
  const positions = response.data.map((position) => ({
    ...position,
  }));
  return positions;
}
