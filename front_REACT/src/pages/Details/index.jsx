import { Container, Links, Content } from "./styles";
import { Button } from "../../components/Button";
import { Header } from "../../components/Header";
import { Section } from "../../components/Section";
import { Tag } from "../../components/Tag";
import { ButtonText } from "../../components/ButtonText";

export function Details() {

  return (
    <Container>
      <Header />

      <main>
        <Content>

          <ButtonText title="Excluir nota" />

          <h1>
            Introdução ao React
          </h1>

          <p>
            Lorem ipsum dolor sit amet consectetur adipisicing elit. Inventore quisquam animi
            fugiat doloremque facere maxime vitae, tenetur, iste doloribus officia ut modi
            dolorum, quidem nulla aliquid. Praesentium non molestias quis.
          </p>

          <Section title="Links Úteis">
            <Links>
              <li><a target="blank" href="https://www.rocketseat.com.br">https://www.rocketseat.com.br</a></li>
              <li><a target="blank" href="https://www.rocketseat.com.br">https://www.rocketseat.com.br</a></li>
            </Links>
          </Section>

          <Section title="Marcadores">
            <Tag title="Express" />
            <Tag title="NodeJS" />
          </Section>

          <Button title="Voltar" />

        </Content>
      </main>
    </Container>
  )
}