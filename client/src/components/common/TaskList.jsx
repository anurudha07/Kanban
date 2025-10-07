import React, { useMemo, useState } from "react";
import {
  Box,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  IconButton,
  Select,
  MenuItem,
} from "@mui/material";
import EditOutlinedIcon from "@mui/icons-material/EditOutlined";
import taskApi from "../../api/taskApi";
import boardApi from "../../api/boardApi";
import TaskModal from "./TaskModal";

const TaskList = ({ sections = [], boardId, onReload = () => {} }) => {
  const [loadingIds, setLoadingIds] = useState(new Set());
  const [editingTask, setEditingTask] = useState(null);

  const tasks = useMemo(() => {
    const out = [];
    sections.forEach((sec) => {
      (sec.tasks || []).forEach((t) => {
        out.push({
          ...t,
          sectionId: sec.id,
          sectionTitle: sec.title || "Untitled",
        });
      });
    });
    return out;
  }, [sections]);

  const startLoading = (id) => setLoadingIds((prev) => new Set(prev).add(id));
  const stopLoading = (id) =>
    setLoadingIds((prev) => {
      const s = new Set(prev);
      s.delete(id);
      return s;
    });

  const handleChangeStatus = async (task, newSectionId) => {
    if (task.sectionId === newSectionId) return;
    startLoading(task.id);
    try {
      await taskApi.update(boardId, task.id, { section: newSectionId });
      const updated = await boardApi.getOne(boardId);
      onReload(updated);
    } catch (err) {
      console.error("Failed to change status", err);
    } finally {
      stopLoading(task.id);
    }
  };

  return (
    <Box
      sx={{
        width: "100%",
        px: { xs: 1, sm: 2 },
        py: 1,
        display: "flex",
        justifyContent: "left",
      }}
    >
      <TableContainer
        sx={{
          boxShadow: "none",
          width: "100%",
          maxWidth: "480px",
        }}
      >
        <Table size="small" sx={{ width: "100%" }}>
          <TableHead>
            <TableRow sx={{ borderBottom: "1px solid rgba(0,0,0,0.06)" }}>
              <TableCell
                sx={{
                  py: 1,
                  px: 0.75,
                  fontWeight: 600,
                  fontSize: "0.75rem",
                }}
              >
                Task
              </TableCell>

              <TableCell
                align="center"
                sx={{
                  py: 0.35,
                  px: 0.75,
                  fontWeight: 600,
                  fontSize: "0.75rem",
                  width: 140,
                }}
              >
                Status
              </TableCell>

              <TableCell
                align="right"
                sx={{
                  py: 0.35,
                  px: 0.75,
                  fontWeight: 600,
                  fontSize: "0.75rem",
                  width: 90,
                }}
              >
                Actions
              </TableCell>
            </TableRow>
          </TableHead>

          <TableBody>
            {tasks.length === 0 && (
              <TableRow sx={{ borderBottom: "none" }}>
                <TableCell
                  colSpan={3}
                  sx={{
                    textAlign: "center",
                    py: 2,
                    fontSize: "0.75rem",
                    color: "text.secondary",
                    borderBottom: "none",
                  }}
                >
                  No tasks yet
                </TableCell>
              </TableRow>
            )}

            {tasks.map((task) => (
              <TableRow
                key={task.id}
                hover
                sx={{
                  borderBottom: "5px solid rgba(0,0,0,0.04)",
                }}
              >
                <TableCell
                  onClick={() => setEditingTask(task)}
                  title={
                    task.title ||
                    task.content?.replace(/<[^>]+>/g, "") ||
                    "Untitled"
                  }
                  sx={{
                    py: 0.5,
                    px: 0.75,
                    fontSize: "0.75rem",
                    cursor: "pointer",
                    lineHeight: 1,
                    whiteSpace: "nowrap",
                    overflow: "hidden",
                    textOverflow: "ellipsis",
                  }}
                >
                  {task.title ||
                    task.content?.replace(/<[^>]+>/g, "").slice(0, 80) ||
                    "Untitled"}
                </TableCell>

                <TableCell align="center" sx={{ py: 0.45, px: 5 }}>
                  <Select
                    value={task.sectionId}
                    onChange={(e) => handleChangeStatus(task, e.target.value)}
                    size="small"
                    sx={{
                      fontSize: "0.72rem",
                      minWidth: { xs: 90, sm: 100 },
                      py: 0.25,
                      "& .MuiOutlinedInput-notchedOutline": {
                        borderColor: "rgba(0,0,0,0.06)",
                      },
                      "& .MuiSelect-select": { py: 0.2 },
                    }}
                  >
                    {sections.map((s) => (
                      <MenuItem
                        key={s.id}
                        value={s.id}
                        sx={{ fontSize: "0.72rem", py: 0.25 }}
                      >
                        {s.title || "Untitled"}
                      </MenuItem>
                    ))}
                  </Select>
                </TableCell>

                <TableCell align="right" sx={{ py: 0.45, px: 0.75 }}>
                  <Box
                    sx={{
                      display: "flex",
                      gap: 0.3,
                      justifyContent: "flex-end",
                    }}
                  >
                    {/* Only Edit button remains */}
                    <IconButton
                      size="small"
                      onClick={() => setEditingTask(task)}
                      sx={{ padding: 0.25 }}
                    >
                      <EditOutlinedIcon fontSize="small" />
                    </IconButton>
                  </Box>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      {editingTask && (
        <TaskModal
          task={editingTask}
          boardId={boardId}
          onClose={() => setEditingTask(null)}
          onUpdate={() => onReload()}
          onDelete={() => onReload()}
        />
      )}
    </Box>
  );
};

export default TaskList;
