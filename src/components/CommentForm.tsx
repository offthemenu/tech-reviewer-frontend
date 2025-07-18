import { TextField, Stack, Button } from '@mui/material';
import { useState } from 'react';
import api from '../services/api';

interface CommentFormProps {
  context: {
    project: string;
    device: string;
    pageName: string;
    pagePath: string;
    filename: string;
    pageNumber?: number;  // optional
  };
  onSuccess?: () => void;
}

export default function CommentForm({ context, onSuccess }: CommentFormProps) {
  const { project, device, pageName, pagePath, filename, pageNumber } = context;
  const [uiComponent, setUiComponent] = useState('');
  const [text, setText] = useState('');
  const [pageNumInput, setPageNumInput] = useState<string>(pageNumber?.toString() || '');


  const submit = async () => {
    if (!text.trim() || !uiComponent.trim()) return;

    const payload: any = {
      project,
      device,
      page_name: pageName,
      page_path: pagePath,
      ui_component: uiComponent.toUpperCase(),
      comment: text,
      filename,
    };
    if (pageNumInput.trim()) {
      payload.page_number = Number(pageNumInput);
    }

    try {
      await api.post('/add_comment', payload);
      setText('');
      setUiComponent('');
      setPageNumInput('');
      onSuccess?.();
    } catch (err) {
      console.error("Failed to submit comment", err);
    }
  };

  return (
      <Stack spacing={2}>
        <TextField
          label="Page Number (optional)"
          type="number"
          inputProps={{ min: 1 }}
          value={pageNumInput}
          onKeyDown={(e) => {
            if (['e', '+', '-'].includes(e.key)) e.preventDefault();
          }}
          onChange={(e) => setPageNumInput(e.target.value)}
          size="small"
          fullWidth
        />

        <TextField
          label="UI Component"
          placeholder="e.g. 1 - BUTTON, 2 - TEXT"
          value={uiComponent}
          onChange={(e) => setUiComponent(e.target.value)}
          size="small"
          fullWidth
        />

        <TextField
          label="Review Comment"
          placeholder="Add technical review comment for this component"
          value={text}
          onChange={(e) => setText(e.target.value)}
          multiline
          minRows={4}
          fullWidth
        />

        <Button
          variant="contained"
          color="primary"
          disabled={!text.trim() || !uiComponent.trim()}
          onClick={submit}
          fullWidth
        >
          Add Comment
        </Button>
      </Stack>
  );
}
