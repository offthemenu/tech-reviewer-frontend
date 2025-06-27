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
      .then((res) => setData(res.data))
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
    <Grid container spacing={2} mt={2} alignItems="center" justifyContent="space-between">
      {/* Project */}
      <Grid>
        <FormControl
          size="small"
          sx={{ minWidth: 100, maxWidth: 100 }}
        >
          <InputLabel id="project-label" shrink>Project</InputLabel>
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
            renderValue={(value) =>
              value === "" ? <em>Select Project</em> : value
            }
          >
            {/* <MenuItem value="">
              <em>Select Project</em>
            </MenuItem> */}
            {projectOptions.map((p) => (
              <MenuItem key={p} value={p}>
                {p}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
      </Grid>

      {/* Device */}
      <Grid>
        <FormControl
          size="small"
          sx={{ minWidth: 100, maxWidth: 100 }}
          disabled={!selectedProject}
        >
          <InputLabel id="device-label" shrink>Device</InputLabel>
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
            renderValue={(value) =>
              value === "" ? <em>Select Device</em> : value
            }
          >
            {/* <MenuItem value="">
              <em>Select Device</em>
            </MenuItem> */}
            {deviceOptions.map((d) => (
              <MenuItem key={d} value={d}>
                {d}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
      </Grid>

      {/* Page */}
      <Grid>
        <FormControl
          size="small"
          sx={{ minWidth: 100, maxWidth: 100 }}
          disabled={!selectedProject || !selectedDevice}
        >
          <InputLabel id="page-label" shrink>Page</InputLabel>
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
            renderValue={(value) =>
              value === "" ? <em>Select Page</em> : value
            }
          >
            {/* <MenuItem value="">
              <em>Select Page</em>
            </MenuItem> */}
            {pageOptions.map((p) => (
              <MenuItem key={p.path} value={p.name}>
                {p.name}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
      </Grid>
    </Grid>
  );
}
