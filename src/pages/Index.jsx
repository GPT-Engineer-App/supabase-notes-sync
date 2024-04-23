import { useState, useEffect } from "react";
import { Box, Heading, Input, Button, Flex, Stack, IconButton, useToast } from "@chakra-ui/react";
import { FaPlus, FaTrash } from "react-icons/fa";

const SUPABASE_URL = "https://mnwefvnykbgyhbdzpleh.supabase.co";
const SUPABASE_ANON_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im1ud2Vmdm55a2JneWhiZHpwbGVoIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MTMyNzQ3MzQsImV4cCI6MjAyODg1MDczNH0.tnHysd1LqayzpQ1L-PImcvlkUmkNvocpMS7tS-hYZNg";

const Index = () => {
  const [notes, setNotes] = useState([]);
  const [title, setTitle] = useState("");
  const toast = useToast();

  useEffect(() => {
    fetchNotes();
  }, []);

  const fetchNotes = async () => {
    const res = await fetch(`${SUPABASE_URL}/rest/v1/notes`, {
      headers: {
        apikey: SUPABASE_ANON_KEY,
        Authorization: `Bearer ${SUPABASE_ANON_KEY}`,
      },
    });
    const data = await res.json();
    setNotes(data);
  };

  const addNote = async () => {
    const note = { title };
    const res = await fetch(`${SUPABASE_URL}/rest/v1/notes`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        apikey: SUPABASE_ANON_KEY,
        Authorization: `Bearer ${SUPABASE_ANON_KEY}`,
      },
      body: JSON.stringify(note),
    });

    if (res.ok) {
      setTitle("");
      fetchNotes();
      toast({
        title: "Note created.",
        status: "success",
        duration: 2000,
        isClosable: true,
      });
    }
  };

  const deleteNote = async (id) => {
    const res = await fetch(`${SUPABASE_URL}/rest/v1/notes?id=eq.${id}`, {
      method: "DELETE",
      headers: {
        apikey: SUPABASE_ANON_KEY,
        Authorization: `Bearer ${SUPABASE_ANON_KEY}`,
      },
    });

    if (res.ok) {
      fetchNotes();
      toast({
        title: "Note deleted.",
        status: "success",
        duration: 2000,
        isClosable: true,
      });
    }
  };

  return (
    <Box maxWidth="600px" margin="auto" p={4}>
      <Heading as="h1" mb={8}>
        Notes App
      </Heading>
      <Flex mb={8}>
        <Input value={title} onChange={(e) => setTitle(e.target.value)} placeholder="Enter a title for this note..." mr={4} />
        <Button onClick={addNote} colorScheme="teal">
          <FaPlus />
        </Button>
      </Flex>
      <Stack spacing={4}>
        {notes.map((note) => (
          <Flex key={note.id} p={4} bg="gray.100" borderRadius="md" alignItems="center">
            <Box flex={1}>{note.title}</Box>
            <IconButton icon={<FaTrash />} onClick={() => deleteNote(note.id)} aria-label="Delete note" />
          </Flex>
        ))}
      </Stack>
    </Box>
  );
};

export default Index;
