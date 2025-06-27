import {
  Grid,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  type SelectChangeEvent,
} from "@mui/material";
import { useEffect, useState } from "react";
import api from "../services/api";

type WireframeDropdownData = {
  projects: string[];
  devices_by_project: Record<string, string[]>;
  pages_by_project_device: Record<string, { name: string; path: string }[]>;
};

type DropdownsProps = {
  selectedProject: string;
  selectedDevice: string;
  selectedPage: string;
  onProjectChange: (value: string) => void;
  onDeviceChange: (value: string) => void;
  onPageChange: (pageName: string, pagePath: string) => void;
};

export default function Dropdowns({
  selectedProject,
  selectedDevice,
  selectedPage,
  onProjectChange,
  onDeviceChange,
  onPageChange,
}: DropdownsProps) {
  const [data, setData] = useState<WireframeDropdownData | null>(null);

  useEffect(() => {
    api.get("/wireframe")
      .then((res: { data: WireframeDropdownData }) => setData(res.data))
      .catch(console.error);
  }, []);

  if (!data) return <div>Loading...</div>;

  const projectOptions = data.projects;
  const deviceOptions = selectedProject
    ? data.devices_by_project[selectedProject] || []
    : [];
  const pageOptions =
    selectedProject && selectedDevice
      ? data.pages_by_project_device[`${selectedProject}_${selectedDevice}`] || []
      : [];

  return (
    <Grid container spacing={3} mt={2} alignItems="center">
      {/* Project Dropdown */}
      <Grid>
        <FormControl size="small" sx={{ minWidth: 150, maxWidth: 150 }}>
          <InputLabel id="project-label">Project</InputLabel>
          <Select
            labelId="project-label"
            id="project-select"
            value={selectedProject}
            label="Project"
            sx={{
              fontSize: "0.85rem",
              lineHeight: "1.5", // Ensures text isn't vertically compressed
              ".MuiSelect-select": {
                paddingTop: "8px",
                paddingBottom: "8px",
                alignItems: "center",
              }
            }}
            onChange={(e: SelectChangeEvent) => {
              onProjectChange(e.target.value);
              onDeviceChange("");
              onPageChange("", "");
            }}
            displayEmpty
          >
            {projectOptions.map((p) => (
              <MenuItem key={p} value={p} sx={{ fontSize: "0.85rem" }}>
                {p}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
      </Grid>

      {/* Device Dropdown */}
      <Grid>
        <FormControl
          size="small"
          sx={{ minWidth: 150, maxWidth: 150 }}
          disabled={!selectedProject}
        >
          <InputLabel id="device-label">Device</InputLabel>
          <Select
            labelId="device-label"
            id="device-select"
            value={selectedDevice}
            label="Device"
            sx={{
              fontSize: "0.85rem",
              lineHeight: "1.5", // Ensures text isn't vertically compressed
              ".MuiSelect-select": {
                paddingTop: "8px",
                paddingBottom: "8px",
                alignItems: "center",
              }
            }}
            onChange={(e: SelectChangeEvent) => {
              onDeviceChange(e.target.value);
              onPageChange("", "");
            }}
            displayEmpty
          >
            {deviceOptions.map((d) => (
              <MenuItem key={d} value={d} sx={{ fontSize: "0.85rem" }}>
                {d}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
      </Grid>

      {/* Page Dropdown */}
      <Grid>
        <FormControl
          size="small"
          sx={{ minWidth: 150, maxWidth: 150 }}
          disabled={!selectedProject || !selectedDevice}
        >
          <InputLabel id="page-label">Page</InputLabel>
          <Select
            labelId="page-label"
            id="page-select"
            value={selectedPage}
            label="Page"
            sx={{
              fontSize: "0.85rem",
              lineHeight: "1.5", // Ensures text isn't vertically compressed
              ".MuiSelect-select": {
                paddingTop: "8px",
                paddingBottom: "8px",
                alignItems: "center",
              }
            }}
            onChange={(e: SelectChangeEvent) => {
              const name = e.target.value;
              const entry = pageOptions.find((p) => p.name === name);
              onPageChange(name, entry?.path ?? "");
            }}
            displayEmpty
          >
            {pageOptions.map((p) => (
              <MenuItem key={p.path} value={p.name} sx={{ fontSize: "0.85rem" }}>
                {p.name}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
      </Grid>
    </Grid>
  );
}
