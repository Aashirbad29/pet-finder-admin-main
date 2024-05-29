import React, { useState } from "react";
import PetTable from "./components/pet-table";
import PetCreate from "./components/pet-create";

const Pet = () => {
  return (
    <>
      <PetCreate button={"Create new pet"} />
      <PetTable />
    </>
  );
};

export default Pet;
