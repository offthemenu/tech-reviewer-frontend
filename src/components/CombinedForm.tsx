import { Box, Stack, TextField, Button, FormControl, InputLabel, Select, MenuItem, Divider } from "@mui/material";
import { useState } from "react";
import api from "../services/api";

type WireframeDropdownData = {
    projects: string[];
    devices_by_project: Record<string, string[]>;
    pages_by_project_device: Record<string, { name: string; path: string }[]>;
};

interface CombinedFormProps {
    wireframes: WireframeDropdownData;
    context: { project: string; device: string; pageName: string; pagePath: string; filename: string };
    setContext: (ctx: { project: string; device: string; pageName: string; pagePath: string }) => void;
    onSuccess?: () => void;
}

export default function CombinedForm({ wireframes, context, setContext, onSuccess }: CombinedFormProps) {
    const { project, device, pageName, pagePath, filename } = context;

    const deviceOptions = project ? wireframes.devices_by_project[project] : [];
    const pageOptions = project && device ? wireframes.pages_by_project_device[`${project}_${device}`] : [];

    const [uiComponent, setUiComponent] = useState("");
    const [text, setText] = useState("");
    const [pageInput, setPageInput] = useState("");

    const submit = async () => {
        if (!project || !device || !pageName || !uiComponent.trim() || !text.trim()) return;
        try {
            await api.post("/add_comment", {
                project, device, page_name: pageName, page_path: pagePath,
                ui_component: uiComponent.toUpperCase(),
                comment: text,
                filename,
                ...(pageInput.trim() && { page_number: Number(pageInput) }),
            });
            setUiComponent("");
            setText("");
            // setPageInput("");
            onSuccess?.();
        } catch (e) {
            console.error("Failed to submit comment", e);
        }
    };

    return (
        <Stack spacing={3}>
            <Stack
                direction="row"
                spacing={5}
                divider={<Divider orientation="vertical" flexItem />}
            >
                {/* Project */}
                <FormControl fullWidth size="small">
                    <InputLabel>Project</InputLabel>
                    <Select value={project} onChange={e => setContext({ project: e.target.value, device: "", pageName: "", pagePath: "" })} label="Project">
                        {wireframes.projects.map(p => <MenuItem key={p} value={p}>{p}</MenuItem>)}
                    </Select>
                </FormControl>

                {/* Device */}
                <FormControl fullWidth size="small" disabled={!project}>
                    <InputLabel>Device</InputLabel>
                    <Select value={device} onChange={e => setContext({ project, device: e.target.value, pageName: "", pagePath: "" })} label="Device">
                        {deviceOptions.map(d => <MenuItem key={d} value={d}>{d}</MenuItem>)}
                    </Select>
                </FormControl>

                {/* Page number input */}
                <TextField
                    label="Page Number (Recommended)"
                    type="number"
                    value={pageInput}
                    onChange={e => setPageInput(e.target.value)}
                    size="small"
                    fullWidth
                    InputProps={{ inputProps: { min: 1 } }}
                />

                {/* Page */}
                <FormControl fullWidth size="small" disabled={!device}>
                    <InputLabel>Page</InputLabel>
                    <Select
                        value={pageName}
                        onChange={e => {
                            const name = e.target.value;
                            const entry = pageOptions.find(o => o.name === name);
                            setContext({ project, device, pageName: name, pagePath: entry?.path || "" });
                        }}
                        label="Page"
                    >
                        {pageOptions.map(o => <MenuItem key={o.path} value={o.name}>{o.name}</MenuItem>)}
                    </Select>
                </FormControl>
                {/* UI Component */}
                <TextField label="UI Component" value={uiComponent} onChange={e => setUiComponent(e.target.value)} size="small" fullWidth />

            </Stack>


            {/* Comment */}
            <TextField label="Review Comment" value={text} onChange={e => setText(e.target.value)} multiline minRows={3} fullWidth />

            <Button variant="contained" disabled={!text.trim() || !uiComponent.trim() || !pageName} onClick={submit}>
                Add Comment
            </Button>
        </Stack>
    );
}
