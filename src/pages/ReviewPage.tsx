import { Stack, Box, Typography, Paper } from "@mui/material";
import Grid from "@mui/material/Grid"
import { useEffect, useState } from "react";
import api from "../services/api";
import PDFUpload from "../components/PDFUpload";
import PDFViewer from "../components/PDFViewer";
import CommentForm from "../components/CommentForm";
import CommentList from "../components/CommentList";
import Dropdowns from "../components/Dropdowns";

type WireframeDropdownData = {
  projects: string[];
  devices_by_project: Record<string, string[]>;
  pages_by_project_device: Record<string, { name: string; path: string }[]>;
};

export default function ReviewPage() {
  const [data, setData] = useState<WireframeDropdownData | null>(null);
  const [uploadedPdf, setUploadedPdf] = useState<string | null>(null);

  const [project, setProject] = useState("");
  const [device, setDevice] = useState("");
  const [pageName, setPageName] = useState("");
  const [pagePath, setPagePath] = useState("");

  const [refreshFlag, setRefreshFlag] = useState(false);
  const triggerRefresh = () => setRefreshFlag((prev) => !prev);

  useEffect(() => {
    api.get("/wireframe").then((res) => setData(res.data)).catch(console.error);
  }, []);

  if (!data) return <div>Loading...</div>;

  return (
    <Box sx={{ width: '100%', maxWidth: '2100px', mx: 'auto', p: 4, display: 'flex', flexDirection: 'column', gap: 2, }}>
      {/* Title */}
      <Typography variant="h2" fontWeight={600} mb={3}>
        wA FE Wireframe  Technical Reviewer
      </Typography>

      {/* PDF Uploader */}
      <Stack spacing={5} mb={3}>
          <PDFUpload onUpload={(filename) => setUploadedPdf(filename)} />
      </Stack>

      <Paper elevation={4} sx={{ p: 2 }}>
        <Grid container spacing={4} alignItems="flex-start">
          {/* PDF Components */}
          <Grid size={{ xs: 15, md: 9 }}>
            <Stack spacing={2} mb={3}>
              <PDFViewer filename={uploadedPdf} />
            </Stack>
          </Grid>

          <Grid size={{ xs: 15, md: 3 }}>
            <Stack spacing={3}>
              <Dropdowns
                selectedProject={project}
                selectedDevice={device}
                selectedPage={pageName}
                onProjectChange={(p) => {
                  setProject(p);
                  setDevice("");
                  setPageName("");
                  setPagePath("");
                }}
                onDeviceChange={(d) => {
                  setDevice(d);
                  setPageName("");
                  setPagePath("");
                }}
                onPageChange={(name, path) => {
                  setPageName(name);
                  setPagePath(path);
                }}
              />

              {project && device && pageName && uploadedPdf && (
                <CommentForm
                  context={{
                    project,
                    device,
                    pageName,
                    pagePath,
                    filename: uploadedPdf,
                  }}
                  onSuccess={triggerRefresh}
                />
              )}
            </Stack>
          </Grid>
        </Grid>
      </Paper>

      <CommentList project={project} device={device} refreshFlag={refreshFlag} />
    </Box>
  );
}
