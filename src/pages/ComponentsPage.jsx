import { useState } from "react";
import { LeftArrowIcon, PlusIcon, RightArrowIcon } from "../components/icons";
import { Footer, NavBar } from "../components/layout";
import { Button, AppLink, Logo, Input, Textarea, Select } from "../components/ui";

export function ComponentsPage() {
  const [selectedOption, setSelectedOption] = useState("");
  const sampleOptions = [
    { value: "remeras", label: "Remeras" },
    { value: "buzos", label: "Buzos" },
  ];

  return (
    <div className="flex flex-col gap-12 items-start w-full">
      <section className="flex gap-12 p-8 justify-between w-full">
        <div className="flex flex-col gap-4">
          <h3>Logo</h3>
          <Logo />
        </div>

        <div className="flex flex-col gap-4">
          <h3>Botones</h3>
          <div className="flex flex-col gap-4">
            <Button>Botón</Button>
            <Button variant="outline">Botón</Button>
            <Button variant="text">
              <PlusIcon />
              <span>Botón</span>
            </Button>
          </div>
        </div>

        <div className="flex flex-col gap-4">
          <h3>Links</h3>
          <div className="flex flex-col gap-4">
            <AppLink to="/home">Link</AppLink>
            <AppLink to="#">
              <span>Link</span>
              <RightArrowIcon />
            </AppLink>
            <AppLink to="#">
              <LeftArrowIcon />
              <span>Link</span>
            </AppLink>
            <AppLink variant="underline" to="#">
              Link
            </AppLink>
          </div>
        </div>

        <div className="flex flex-col gap-4">
          <h3>Inputs</h3>
          <Input label="Input" type="text" placeholder="Placeholder" />
          <Input
            label="Contraseña"
            type="password"
            placeholder="Escribe tu contraseña"
          />
          <Textarea label="Textarea" placeholder="Escribe tu mensaje" />
          <Select
            label="Select"
            onChange={(event) => setSelectedOption(event.target.value)}
            value={selectedOption}
            placeholder="Selecciona una opción"
          >
            {sampleOptions.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </Select>
        </div>
      </section>

      <section className="flex gap-12 w-full">
        <div className="flex flex-col gap-4 w-full">
          <h3 className="p-8">NavBar</h3>
          <NavBar />
        </div>
      </section>

      <section className="flex gap-12 w-full">
        <div className="flex flex-col gap-4 w-full">
          <h3 className="p-8">Footer</h3>
          <Footer />
        </div>
      </section>
    </div>
  );
}
