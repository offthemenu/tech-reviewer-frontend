import { Stack, Box, Typography, Paper } from "@mui/material";
import { useEffect, useState } from "react";
import api from "../services/api";
import PDFUpload from "../components/PDFUpload";
import PDFViewer from "../components/PDFViewer";
import CombinedForm from "../components/CombinedForm";
import CommentList from "../components/CommentList";

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
  const triggerRefresh = () => setRefreshFlag(prev => !prev);

  useEffect(() => {
    api.get("/wireframe")
      .then((res: { data: WireframeDropdownData }) => setData(res.data))
      .catch(console.error);
  }, []);

  if (!data) return <div>Loading…</div>;

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
      {/* Title */}
      <Typography variant="h4" fontWeight={600}>
        wA FE Wireframe Technical Reviewer
      </Typography>

      {/* PDF Upload */}
      <Stack spacing={3}>
        <PDFUpload onUpload={filename => setUploadedPdf(filename)} />
      </Stack>

      {/* Viewer + Combined Form */}
      <Paper elevation={3} sx={{ p: 3, display: "flex", flexDirection: "column", gap: 3 }}>
        {/* PDF Viewer */}
        <Box>
          <PDFViewer filename={uploadedPdf} />
        </Box>

        {/* Combined Dropdowns + Comment Form */}
        {uploadedPdf && (
          <CombinedForm
            wireframes={data}
            context={{
              project,
              device,
              pageName,
              pagePath,
              filename: uploadedPdf,
            }}
            setContext={({ project: p, device: d, pageName: pn, pagePath: pp }) => {
              setProject(p);
              setDevice(d);
              setPageName(pn);
              setPagePath(pp);
            }}
            onSuccess={triggerRefresh}
          />
        )}
      </Paper>

      {/* Comment List */}
      <CommentList
        project={project}
        device={device}
        refreshFlag={refreshFlag}
      />
    </Box>
  );
}
