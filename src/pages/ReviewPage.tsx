import { Stack, Box, Typography, Paper, Grid } from "@mui/material";
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
    api
      .get("/wireframe")
      .then((res: { data: WireframeDropdownData }) => setData(res.data))
      .catch(console.error);
  }, []);

  if (!data) return <div>Loading...</div>;

  return (
    <Box
      sx={{
        width: "100%",
        maxWidth: "1920px",
        mx: "auto",
        p: 4,
        display: "flex",
        flexDirection: "column",
        gap: 3,
      }}
    >
      {/* Page Title */}
      <Typography variant="h4" fontWeight={600} mb={2}>
        wA FE Wireframe Technical Reviewer
      </Typography>

      {/* PDF Upload Box */}
      <Stack spacing={3}>
        <PDFUpload onUpload={(filename) => setUploadedPdf(filename)} />
      </Stack>

      {/* Main Content Block */}
      <Paper elevation={3} sx={{ p: 3 }}>
        <Grid container spacing={3} alignItems="flex-start">
          {/* Left Column: PDF Viewer */}
          <Grid size={ {xs:12, md:10} }>
            <PDFViewer filename={uploadedPdf} />
          </Grid>

          {/* Right Column: Dropdowns + Comment Form */}
          <Grid size={ {xs:12, md:2 }}>
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

      {/* Comment Table */}
      <CommentList
        project={project}
        device={device}
        refreshFlag={refreshFlag}
      />
    </Box>
  );
}
