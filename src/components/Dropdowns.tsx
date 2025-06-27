import {
  Stack,
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
    api
      .get("/wireframe")
      .then((res: { data: WireframeDropdownData }) => setData(res.data))
      .catch(console.error);
  }, []);

  if (!data) return <div>Loading...</div>;

  const projectOptions = data.projects;
  const deviceOptions =
    selectedProject ? data.devices_by_project[selectedProject] || [] : [];
  const pageOptions =
    selectedProject && selectedDevice
      ? data.pages_by_project_device[`${selectedProject}_${selectedDevice}`] || []
      : [];

  const sharedSx = {
    minWidth: 200,
    maxWidth: 250,
    fontSize: "0.85rem",
    ".MuiSelect-select": {
      paddingTop: "8px",
      paddingBottom: "8px",
    },
  };

  return (
    <Stack spacing={2} alignItems="flex-start">
      {/* Project Dropdown */}
      <FormControl size="small" sx={{ width: '100%', ...sharedSx }}>
        <InputLabel id="project-label">Project</InputLabel>
        <Select
          labelId="project-label"
          id="project-select"
          value={selectedProject}
          label="Project"
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

      {/* Device Dropdown */}
      <FormControl
        size="small"
        sx={{ width: '100%', ...sharedSx }}
        disabled={!selectedProject}
      >
        <InputLabel id="device-label">Device</InputLabel>
        <Select
          labelId="device-label"
          id="device-select"
          value={selectedDevice}
          label="Device"
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

      {/* Page Dropdown */}
      <FormControl
        size="small"
        sx={{ width: '100%', ...sharedSx }}
        disabled={!selectedProject || !selectedDevice}
      >
        <InputLabel id="page-label">Page</InputLabel>
        <Select
          labelId="page-label"
          id="page-select"
          value={selectedPage}
          label="Page"
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
    </Stack>
  );
}
