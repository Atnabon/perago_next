"use client"
import { createContext, useContext, useState } from 'react';
import useSWR from 'swr';
import mongoose from "mongoose";


const PositionContext = createContext();

async function fetchPositions() {
  const res = await fetch(process.env.MONGODB_URI);

  if (!res.ok) {
    throw new Error('Failed to fetch data');
  }

  return res.json();
}

export function PositionProvider({ children }) {
  const { data: positions, error } = useSWR('api/positions', fetchPositions);
  const [statePositions, setStatePositions] = useState(positions || []);

  const setPositions = (newPositions) => {
    setStatePositions(newPositions);
  };

  const addPosition = async (position) => {
    try {

      const res = await fetch("/api/positions", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(position),
      });

      if (
        !res.ok ||
        !res.headers.get("Content-Type").includes("application/json")
      ) {
        throw new Error("Failed to add position");
      }
      const data = await res.json();
      setPositions([...statePositions, data]);
    } catch (error) {
      console.error(error);
    }
  };

  const updatePosition = async (position) => {
    console.log("updated data::", position);
    try {
      const res = await fetch(`/api/positions/${position.id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(position),
      });

      if (!res.ok) {
        const errorResponse = await res.json();
        throw new Error(
          `Failed to update position with ID: ${
            position.id
          }. Error: ${JSON.stringify(errorResponse)}`
        );
      }

      const data = await res.json();
      const index = statePositions.findIndex((p) => p.id === position.id);
      const updatedPositions = [...statePositions];
      updatedPositions[index] = position;
      setPositions(updatedPositions);
    } catch (error) {
      console.error(error);
    }
  };


 const deletePosition = async (positionId) => {
   console.log("we're here", positionId);

   try {
     const res = await fetch(`/api/positions`, {
       method: "DELETE",
       headers: {
         "Content-Type": "application/json",
       },
       body: JSON.stringify({ positionId }), // Send the positionId as JSON payload
     });

     // Check if the response status is not okay (e.g., 404 Not Found)
     if (!res.ok) {
       throw new Error(`Failed to delete position with ID: ${positionId}`);
     }

     // If the server returns an empty response, we can assume the deletion was successful
     // So, you don't necessarily need to use `res.json()`

     // Update the positions state by filtering out the deleted position
     const updatedPositions = statePositions.filter(
       (p) => p._id !== positionId
     ); // Use _id, assuming it's the correct identifier
     setPositions(updatedPositions);
     window.location.reload()
   } catch (error) {
     console.error(error);
   }
 };



  return (
    <PositionContext.Provider
      value={{
        positions: statePositions,
        setPositions,
        addPosition,
        updatePosition,
        deletePosition,
      }}
    >
      {children}
    </PositionContext.Provider>
  );
}

export function usePosition() {
  const context = useContext(PositionContext);
  if (context === undefined) {
    throw new Error('usePosition must be used within a PositionProvider');
  }
  const {
    positions = [],
    setPositions,
    addPosition,
    updatePosition,
    deletePosition,
  } = context;
  return {
    positions,
    setPositions,
    addPosition,
    updatePosition,
    deletePosition,
  };
}
