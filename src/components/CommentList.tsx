import {
  Paper,
  Table,
  TableHead,
  TableBody,
  TableRow,
  TableCell,
  Checkbox,
  Typography,
  Button,
  Box,
} from '@mui/material';
// import html2pdf from 'html2pdf.js';
import { useEffect, useState } from 'react';
import api from '../services/api';

type Comment = {
  id: number;
  project: string;
  device: string;
  ui_component: string;
  comment: string;
  created_at: string;
  page_name: string;
  page_path: string;
};

export default function CommentList({
  project,
  device,
  refreshFlag,
}: {
  project: string;
  device: string;
  refreshFlag: boolean;
}) {
  const [comments, setComments] = useState<Comment[]>([]);
  const [selectedIds, setSelectedIds] = useState<Set<number>>(new Set());

  const handleCopyMarkdown = () => {
    const header = `| Page Name | Page Path | UI Component | Comment |\n| --- | --- | --- | --- |\n`;
    const rows = comments
      .map(c => `| ${c.page_name} | ${c.page_path} | ${c.ui_component} | ${c.comment} |`)
      .join('\n');
    const markdown = header + rows;

    navigator.clipboard.writeText(markdown)
      .then(() => alert("📋 Markdown copied to clipboard!"))
      .catch((err) => console.error("Failed to copy markdown", err));
  };


  // const handleExportPdf = () => {
  //   const element = document.getElementById('comment-table');
  //   if (!element) return;

  //   html2pdf()
  //     .set({
  //       margin: 0.5,
  //       filename: `tech_review_comments_${project}_${device}.pdf`,
  //       image: { type: 'jpeg', quality: 0.98 },
  //       html2canvas: { scale: 2 },
  //       jsPDF: { unit: 'in', format: 'letter', orientation: 'landscape' },
  //     })
  //     .from(element)
  //     .save();
  // };


  const fetchComments = () => {
    if (!project || !device) return;

    api
      .get('/comments', { params: { project, device } })
      .then((res: { data: Comment[] }) => {
        setComments(res.data);
      })
      .catch(console.error);
  };

  useEffect(() => {
    fetchComments();
  }, [project, device, refreshFlag]);

  const toggle = (id: number) => {
    setSelectedIds((prev) => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });
  };

  const handleDelete = async () => {
    for (const id of selectedIds) {
      await api.delete(`/comment/${id}`);
    }
    setComments((prev) => prev.filter((c) => !selectedIds.has(c.id)));
    setSelectedIds(new Set());
  };

  return (
    <Paper id="comment-table" sx={{ mt: 6, p: 3, overflowX: 'auto' }} elevation={2}>
      <Typography variant="h6" fontWeight={600} mb={2}>
        Technical Review Comments
      </Typography>

      <Table size="small">
        <TableHead>
          <TableRow sx={{ backgroundColor: '#f3f4f6' }}>
            <TableCell padding="checkbox" />
            <TableCell>Page Name</TableCell>
            <TableCell>Page Path</TableCell>
            <TableCell>UI Component</TableCell>
            <TableCell>Comment</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {comments.map((c) => (
            <TableRow key={c.id} hover>
              <TableCell padding="checkbox">
                <Checkbox
                  checked={selectedIds.has(c.id)}
                  onChange={() => toggle(c.id)}
                />
              </TableCell>
              <TableCell>{c.page_name}</TableCell>
              <TableCell>{c.page_path}</TableCell>
              <TableCell>{c.ui_component}</TableCell>
              <TableCell>{c.comment}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>

      {selectedIds.size > 0 && (
        <Box mt={3} display="flex" alignItems="center">
          <Typography variant="body2">
            {selectedIds.size} item(s) selected
          </Typography>
          <Button
            variant="contained"
            color="error"
            onClick={handleDelete}
            sx={{ ml: 'auto' }}
          >
            Delete
          </Button>
        </Box>
      )}

      <Box mt={4} display="flex" justifyContent="flex-end " gap={2}>
        <Button variant="outlined" onClick={handleCopyMarkdown}>
          Copy as Markdown
        </Button>
        {/* <Button variant="outlined" onClick={handleExportPdf}>
          Export as PDF
        </Button> */}
      </Box>
    </Paper>
  );
}
