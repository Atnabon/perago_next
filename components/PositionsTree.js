"use client";
import { useForm } from "react-hook-form";
import { TreeItem, useTreeItem } from "@mui/lab";
import { TreeView } from "@mui/lab";
import Typography from "@mui/material/Typography";
import { styled, alpha } from "@mui/material/styles";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import { IconButton } from "@mui/material";
import { usePosition } from "@/context/PositionContext.js";
import { Edit as EditIcon, Delete as DeleteIcon } from "@mui/icons-material";

import { useState, useEffect } from "react";
import clsx from "clsx";
import useSWR from "swr";
import axios from "axios";
import { useSWRConfig } from "swr";
import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";

const treeLabel = "treeLabel";
const treeActive = "treeActive";
const treeSelected = "treeSelected";



const CustomTreeItem = styled(TreeItem)(({ theme }) => ({
  [`& .${treeLabel}`]: {
    backgroundColor: "transparent",
    borderRadius: "50%",
    width: "1em",
    height: "1em",
    border: `1px solid ${alpha(theme.palette.text.primary, 0.2)}`,
    display: "inline-flex",
    alignItems: "center",
    justifyContent: "center",
    marginRight: theme.spacing(1),
    fontSize: "0.75rem",
    fontWeight: "normal",
    transition: "background-color 0.2s, color 0.2s",
  },
  [`& .${treeActive}`]: {
    backgroundColor: theme.palette.primary.main,
    color: theme.palette.primary.contrastText,
    "&:hover": {
      backgroundColor: theme.palette.primary.dark,
    },
  },
  [`& .${treeSelected}`]: {
    backgroundColor: alpha(theme.palette.primary.main, 0.2),
  },
}));

// const organizationData = [
//   {
//     _id: "64b5328d081dc970a786751f",
//     name: "CEO",
//     description: "description",
//     parentId: null,
//     children: [],
//     __v: 0,
//     id: "64b5328d081dc970a786751f",
//   },
//   {
//     _id: "64b532d54bf7d77c616d5b3b",
//     name: "Director",
//     description: "The Kung Fu Comic by a Kung Fu Master",
//     parentId: "64b5328d081dc970a786751f",
//     children: [],
//     __v: 0,
//     id: "64b532d54bf7d77c616d5b3b",
//   },
//   {
//     _id: "64b5344c081dc970a786752f",
//     name: "dea",
//     description: "lorem ipsum",
//     parentId: "64b5328d081dc970a786751f",
//     children: [],
//     __v: 0,
//     id: "64b5344c081dc970a786752f",
//   },
//   {
//     _id: "64b534f84bf7d77c616d5b48",
//     name: "Chera Weltaji",
//     description:
//       "Describe what you're raising funds to do, why you care about it, how you plan to make it happen, and who you are. Your description should tell backers everything they need to know. If possible, include images to show them what your project is all about and what rewards look like.",
//     parentId: "64b5344c081dc970a786752f",
//     children: [],
//     __v: 0,
//     id: "64b534f84bf7d77c616d5b48",
//   },
//   {
//     _id: "64b539707b4b1dbacfb9e706",
//     name: "gert",
//     description: "fort",
//     parentId: null,
//     children: [],
//     __v: 0,
//     id: "64b539707b4b1dbacfb9e706",
//   },
//   {
//     _id: "64b54f59ab99716886bcf1fd",
//     name: "gamme",
//     description: "ddd",
//     parentId: null,
//     children: [],
//     __v: 0,
//     id: "64b54f59ab99716886bcf1fd",
//   },
//   {
//     _id: "64b55090ab99716886bcf210",
//     name: "Principal",
//     description: "ddd",
//     parentId: "64b55090ab99716886bcf20f",
//     children: [],
//     __v: 0,
//     id: "64b55090ab99716886bcf210",
//   },
//   {
//     _id: "64b550abab99716886bcf214",
//     name: "Quality Assurer",
//     description: "no description",
//     parentId: "64b5328d081dc970a786751f",
//     children: [],
//     __v: 0,
//     id: "64b550abab99716886bcf214",
//   },
//   {
//     _id: "64b550d3ab99716886bcf21a",
//     name: "biniyam",
//     description: "dddd",
//     parentId: "64b550abab99716886bcf214",
//     children: [],
//     __v: 0,
//     id: "64b550d3ab99716886bcf21a",
//   },
//   {
//     _id: "64b551abab99716886bcf223",
//     name: "Property Administration",
//     description: "ddd",
//     parentId: "64b550abab99716886bcf214",
//     children: [],
//     __v: 0,
//     id: "64b551abab99716886bcf223",
//   },
//   {
//     _id: "64b55785ab99716886bcf242",
//     name: "boona",
//     description: "This is manager",
//     parentId: "64b551abab99716886bcf223",
//     children: [],
//     __v: 0,
//     id: "64b55785ab99716886bcf242",
//   },
// ];

export default function PositionTree(props) {
  const { register, handleSubmit, reset, formState } = useForm();
  const [open, setOpen] = useState(false);
  const [positionName, setPositionName] = useState("");
  const [positionDescription, setPositionDescription] = useState("");
  const [selectedPosition, setSelectedPosition] = useState([]);
  const [updatedName, setUpdatedName] = useState('')
  const [updatedId, setUpdatedId] = useState('')
  const [parentId, setParentId] = useState(null);
  const [allPositions,setAllPositions] = useState([])


   async function fetchPositions() {
    const response = await axios.get("/api/positions");
    const positions = response.data.map((position) => ({
      ...position,
      id: position._id.toString(),
    }));
    console.log("positions from position tree", positions);
    setAllPositions(positions)
    return positions;
  }

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClickOpenDialog = () => {
    setSelectedPosition(null); // Reset the selected position state
    setOpen(true);
  };

  const handleClose = () => {
    setPositionName("");
    setPositionDescription("");
    setOpen(false);
    window.location.reload();
  };

  const {
    position,
    pselectedPosition,
    setpSelectedPosition,
    status,
    err,
    addPosition,
    updatePosition,
    deletePosition,
  } = usePosition();
  const { data: positions, error } = useSWR("/api/positions", fetchPositions);
  const [positionNames, setPositionNames] = useState([]);
  const [parentName, setParentNames] = useState([]);
  const [convertedData, setConvertedData] = useState([]);
  const [formData, setFormData] = useState({
    // Initialize other form data properties
    parentId: null, // or provide a default parentId if needed
  });

  const [expanded, setExpanded] = useState([]);

  const handleToggle = (event, nodeIds) => {
    setExpanded(nodeIds);
  };

  const handleDeletePosition = async (positionId) => {
    try {
      await deletePosition(positionId);
      // Assuming pselectedPosition and setpSelectedPosition are defined in your component
      setpSelectedPosition(null);

      // Use the SWRConfig to trigger data refetch after deleting a position
      const { mutate } = useSWRConfig();
      mutate("/api/positions");
    } catch (error) {
      console.error(error);
    }
  };

const editPosition = async (updatedPosition) => {
  // Get the parentId from the state variable
  // const parentId = parentId; // Make sure the variable name matches your state variable name

  try {
    // Reassign the parentId property to the updatedPosition object
    updatedPosition.parentId = parentId;

    // Call the updatePosition function with the updatedPosition object
    await updatePosition({ ...updatedPosition, id: updatedId }); // Make sure updatedId is defined

    // Reset any state or form data as needed
    // setpSelectedPosition(null);
    reset();

    // Optionally, you can update data after updating a position
    // by using the mutate function or any other method based on your requirements.
    // mutate("/api/positions");
  } catch (error) {
    console.error(error);
  }
};


  const handleUpdatePosition = async (data) => {
    console.log("data from update", data);

    setSelectedPosition(data); // Set the selected position
    setPositionName(data.name); // Populate dialog content with selected position data
    setUpdatedId(data.id)
    setPositionDescription(data.description);
    handleClickOpenDialog();
  };

  const buildTree = (items, parentId = null) => {
    const nestedItems = items
      .filter((item) => item.parentId === parentId)
      .map((item) => {
        const children = buildTree(items, item._id);
        return {
          ...item,
          children: children.length ? children : null,
        };
      });

    return nestedItems;
  };
// const handleParentChange = (event) => {
//   const pSelectedParentName = event.target.value;
//   // console.log("ID:", pSelectedParentName);
//   setParentId(pSelectedParentName);
//   setFormData({
//     ...formData,
//     parentId: pSelectedParentName,
//   });
// };
  const handleParentChange = (event) => {
    const pSelectedParentName = event.target.value;
    // setParentId(pSelectedParentName);
    

    // Find the position with the same name as pSelectedParentName
    const positionWithSameName = allPositions.find(
      (position) => position.name === pSelectedParentName
    );

    if (positionWithSameName) {
      // Get the parentId of the found position
      const foundParentId = positionWithSameName.parentId;
      setParentId(foundParentId)
      console.log("Found parentId:", foundParentId);
      setFormData({
        ...formData,
        parentId: foundParentId,
      });
      // Do whatever you need to do with the found parentId here
    } else {
      console.log(
        "No position found with the selected parent name:",
        pSelectedParentName
      );
      // Handle the case when no position with the selected parent name is found
    }
    
  };

  const renderTree = (nodes) => (
    <TreeItem
      key={nodes._id}
      nodeId={nodes._id}
      label={
        <div>
          {nodes.name}
          <IconButton
            onClick={() => handleUpdatePosition(nodes)}
            style={{ marginLeft: 500 }}
          >
            <EditIcon />
          </IconButton>
          <IconButton onClick={() => handleDeletePosition(nodes._id)}>
            <DeleteIcon />
          </IconButton>
        </div>
      }
    >
      {Array.isArray(nodes.children)
        ? nodes.children.map((node) => renderTree(node))
        : null}
    </TreeItem>
  );

  useEffect(() => {
    setConvertedData(Object?.values(positions || []));
  }, [positions]);
  // const convertedData =
  const tree = buildTree(convertedData);
  // console.log(tree);

  // console.log("here is the position", positions);
  useEffect(() => {
    if (positions) {
      console.log("the posistion are here", positions);
      const positionName = positions.map((item) => item.name);
      setPositionNames(positionName);
      const parentName = positions.map((item) => item.parentId);
      setParentNames(parentName);
    }
  }, [positions]);

  // console.log("position names:", positionNames);
  // console.log("parent names:", parentName);
  if (error) {
    return <div>Error loading positions</div>;
  }

  if (!positions) {
    return <div>Loading positions ...</div>;
  }

  const parentLabel = positions[0] ? positions[0].name : "Positions";

  return (
    <div>
      <TreeView
        defaultCollapseIcon={<ExpandMoreIcon />}
        defaultExpandIcon={<ChevronRightIcon />}
        expanded={expanded}
        onNodeToggle={handleToggle}
      >
        {tree.map((node) => renderTree(node))}
      </TreeView>

      <TreeView
        aria-label="icon expansion"
        defaultCollapseIcon={<ExpandMoreIcon />}
        defaultExpandIcon={<ChevronRightIcon />}
        sx={{ height: 240, flexGrow: 1, maxWidth: 400, position: "relative" }}
      >
        {/*{positionNames.map((name) => { 
      return <TreeItem nodeId={name} label={name}> 
 
      </TreeItem> 
    })}  
  */}

        {/* <TreeItem nodeId="1" label="CEO">
          <TreeItem nodeId="2" label="CTO">
            <TreeItem nodeId="3" label="Project Manager">
              {positions.map((position) => (
                <CustomTreeItem
                  key={`position-${position.id}`}
                  nodeId={position.id}
                  label={position.name}
                >
                  {position.children &&
                    position.children.length > 0 &&
                    position.children.map((child) => (
                      <CustomTreeItem
                        key={child.id}
                        nodeId={child.id}
                        label={child.name}
                      />
                    ))}
                </CustomTreeItem>
              ))}
            </TreeItem>
          </TreeItem>
        </TreeItem> */}
        <Dialog
          open={open}
          onClose={handleClose}
          aria-labelledby="alert-dialog-title"
          aria-describedby="alert-dialog-description"
        >
          <DialogTitle
            id="alert-dialog-title"
            style={{ margin: "auto", fontWeight: 700 }}
          >
            {"Update The Position"}
          </DialogTitle>
          <DialogContent className="w-[35vw]">
            <DialogContentText id="alert-dialog-description">
              {/* Let Google help apps determine location. This means sending
              anonymous location data to Google, even when no apps are running. */}
              <form
                onSubmit={handleSubmit(editPosition)}
                className="space-y-4"
              >
                <input
                  type="hidden"
                  // {...register("id")}
                  // value= "test"
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
                    defaultValue={positionName}
                  />
                  {formState.errors.name && (
                    <p className="mt-1 text-sm text-red-500">
                      Name is required
                    </p>
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
                    defaultValue={positionDescription}
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
                      return <option key={position}>{position}</option>;
                    })}
                  </select>
                </div>
                <div className="flex justify-end">
                  <button
                    type="submit"
                    className="px-4 py-2 font-bold text-white bg-gradient-to-r from-blue-400 to-green-500 rounded hover:bg-green-700 shadow-md"
                  >
                   Update
                  </button>
                </div>
              </form>
            </DialogContentText>
          </DialogContent>
          <DialogActions>
            <Button onClick={handleClose}>Cancel</Button>
            {/* <Button autoFocus type="submit">
              Update
            </Button> */}
          </DialogActions>
        </Dialog>
      </TreeView>
    </div>
  );
}
