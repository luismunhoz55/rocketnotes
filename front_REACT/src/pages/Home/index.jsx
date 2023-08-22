import { useState, useEffect } from 'react';
import { FiPlus } from 'react-icons/fi';

import { Container, Brand, Menu, Search, Content, NewNote } from './styles';
import { Header } from '../../components/Header';
import { ButtonText } from '../../components/ButtonText';
import { Input } from '../../components/Input';
import { Section } from '../../components/Section';
import { Note } from '../../components/Note';
import { api } from '../../services/api';

export function Home() {

  const [search, setSearch] = useState("");
  const [tags, setTags] = useState([]);
  const [tagSelected, setTagSelected] = useState([]);
  const [notes, setNotes] = useState([]);

  function handleTagSelected(tagName) {
    if (tagName === "all") {
      return setTagSelected([]);
    }

    const alreadySelected = tagSelected.includes(tagName);

    if (alreadySelected) {
      const filteredTags = tagSelected.filter(tag => tag !== tagName);
      setTagSelected(filteredTags);
      return
    };

    setTagSelected(prevState => [...prevState, tagName]);
    return
  }

  useEffect(() => {
    async function fetchTags() {
      const response = await api.get("/tags");
      setTags(response.data);
    }

    fetchTags();

  }, [])

  useEffect(() => {

    async function fetchNotes() {
      const response = await api.get(`/notes?title=${search}&tags=${tagSelected}`);
      setNotes(response.data);
    }
    fetchNotes();

  }, [tagSelected, search]);

  return (
    <Container>

      <Brand>
        <h1>Rocketnotes</h1>
      </Brand>

      <Header />

      <Menu>
        <li>
          <ButtonText
            title="Todos"
            onClick={() => handleTagSelected("all")}
            isActive={tagSelected.length === 0}
          />
        </li>
        {
          tags && tags.map(tag => (
            <li key={String(tag.id)}>
              <ButtonText
                title={tag.name}
                onClick={() => handleTagSelected(tag.name)}
                isActive={tagSelected.includes(tag.name)}
              />
            </li>
          ))

        }
      </Menu>

      <Search>
        <Input
          placeholder="Pesquisar pelo título"
          onChange={e => setSearch(e.target.value)}
        />
      </Search>

      <Content>
        <Section title="Minhas notas">
          {
            notes.map(note => (
              <Note
                key={String(note.id)}
                data={note} />
            ))
          }
        </Section>
      </Content>

      <NewNote to="/new">
        <FiPlus />
        Criar Nota
      </NewNote>

    </Container>
  );
}