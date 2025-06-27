import { Grid, FormControl, InputLabel, Select, MenuItem } from "@mui/material";

type WireframeDropdownData = {
    projects: string[];
    devices_by_project: Record<string, string[]>;
    pages_by_project_device: Record<string, { name: string; path: string }[]>;
};

type BottomDropdownsProps = {
    selectedProject: string;
    selectedDevice: string;
    selectedPage: string;
    onPageChange: (pageName: string, pagePath: string) => void;
    data: WireframeDropdownData;
};

export function BottomDropdowns({
    selectedProject,
    selectedDevice,
    selectedPage,
    onPageChange,
    data,
}: BottomDropdownsProps) {
    const pageOptions =
        selectedProject && selectedDevice
            ? data.pages_by_project_device[`${selectedProject}_${selectedDevice}`] || []
            : [];

    return (
        <Grid container spacing={2} mt={2}>
            <Grid size={{ xs: 12, sm: 2 }}>
                <FormControl fullWidth>
                    <InputLabel>Page Name</InputLabel>
                    <Select
                        value={selectedPage}
                        label="Page Name"
                        onChange={(e) => {
                            const selName = e.target.value;
                            const entry = pageOptions.find((x) => x.name === selName);
                            onPageChange(selName, entry?.path ?? "");
                        }}
                    >
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
