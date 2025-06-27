import { Stack, Grid, FormControl, InputLabel, Select, MenuItem, type SelectChangeEvent } from "@mui/material";

type WireframeDropdownData = {
    projects: string[];
    devices_by_project: Record<string, string[]>;
    pages_by_project_device: Record<string, { name: string; path: string }[]>;
};

type TopDropdownsProps = {
    selectedProject: string;
    selectedDevice: string;
    onProjectChange: (value: string) => void;
    onDeviceChange: (value: string) => void;
    data: WireframeDropdownData;
};

export function TopDropdowns({
    selectedProject,
    selectedDevice,
    onProjectChange,
    onDeviceChange,
    data,
}: TopDropdownsProps) {
    const projectOptions = data.projects;
    const deviceOptions = selectedProject ? data.devices_by_project[selectedProject] || [] : [];

    return (
        <Stack direction="row" spacing={{ xs: 5, sm: 5, md: 5 }} justifyContent="center" alignItems="center" useFlexGap sx={{ mt: 2, flexWrap: "wrap" }}>
            <Grid>
                <FormControl sx={{ minWidth: 200 }} size="medium">
                    <InputLabel id="project-label">Project</InputLabel>
                    <Select
                        labelId="project-label"
                        id="project-select"
                        value={selectedProject}
                        label="Project"
                        displayEmpty
                        onChange={(e: SelectChangeEvent) => {
                            onProjectChange(e.target.value);
                            onDeviceChange(""); // Clear dependent
                        }}
                    >
                        {projectOptions.map((p) => (
                            <MenuItem key={p} value={p}>
                                {p}
                            </MenuItem>
                        ))}
                    </Select>
                </FormControl>
            </Grid>

            <Grid>
                <FormControl sx={{ minWidth: 200 }} size="medium" disabled={!selectedProject}>
                    <InputLabel id="device-label">Device</InputLabel>
                    <Select
                        labelId="device-label"
                        id="device-select"
                        value={selectedDevice}
                        label="Device"
                        displayEmpty
                        onChange={(e: SelectChangeEvent) => onDeviceChange(e.target.value)}
                    >
                        {deviceOptions.map((d) => (
                            <MenuItem key={d} value={d}>
                                {d}
                            </MenuItem>
                        ))}
                    </Select>
                </FormControl>
            </Grid>
        </Stack>
    );
}