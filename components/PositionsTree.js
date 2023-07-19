"use client";

import { TreeItem, useTreeItem } from "@mui/lab";
import { TreeView } from "@mui/lab";
import { styled, alpha } from "@mui/material/styles";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import { IconButton } from "@mui/material";
import { usePosition } from "@/context/PositionContext.js";
import { Edit as EditIcon, Delete as DeleteIcon } from "@mui/icons-material";
import { useState, useEffect } from "react";
import useSWR, { mutate } from "swr";
import axios from "axios";

const treeLabel = "treeLabel";
const treeActive = "treeActive";
const treeSelected = "treeSelected";

async function fetchPositions() {
  const response = await axios.get("/api/positions");
  const positions = response.data.map((position) => ({
    ...position,
    id: position._id.toString(),
  }));
  return positions;
}

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

export default function PositionTree(props) {
  const {
    position,
    status,
    err,
    addPosition,
    updatePosition,
    deletePosition,
  } = usePosition();
  const { data: positions, error } = useSWR("/api/positions", fetchPositions);
  const [positionNames, setPositionNames] = useState([]);
  const [parentName, setParentNames] = useState([]);
  const[convertedData, setConvertedData] = useState([])

  const [expanded, setExpanded] = useState([]);

  const handleToggle = (event, nodeIds) => {
    setExpanded(nodeIds);
  };

  const handleDeletePosition = async (positionId) => {
    await deletePosition(positionId);
    mutate("/api/positions"); 
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

  const renderTree = (nodes) => (
    <TreeItem
      key={nodes._id}
      nodeId={nodes._id}
      label={
        <div className="flex items-center justify-between">
          {nodes.name}
          <div className="flex items-center">
          <IconButton onClick={() => handleEdit(nodes)} className="mr-2 sm:mr-4">
            <EditIcon />
          </IconButton>
          <IconButton onClick={() => handleDeletePosition(nodes._id)}>
            <DeleteIcon />
          </IconButton>
          </div>
          
        </div>
      }
    >
      {Array.isArray(nodes.children)
        ? nodes.children.map((node) => renderTree(node))
        : null}
    </TreeItem>
  );

  useEffect(() => {
  setConvertedData(Object?.values(positions || []))
},[positions])
  
  const tree = buildTree(convertedData);
  
  useEffect(() => {
    if (positions) {
      console.log("the posistion are here", positions);
      const positionName = positions.map((item) => item.name);
      setPositionNames(positionName);
      const parentName = positions.map((item) => item.parentId);
      setParentNames(parentName);
    }
  }, [positions]);

  if (error) {
    return <div>Error loading positions</div>;
  }

  if (!positions) {
    return <div>Loading Positions ...</div>;
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
    
      </TreeView>
    </div>
  );
}
