"use client";
import Container from "@/app/components/container";
import NewFinancialContributionForm from "../components/newFinancialContributionForm";
import { useSession } from "next-auth/react";
import { redirect } from "next/navigation";

const CadastrarFinanca = () => {
  const { data, status } = useSession();

  return (
    <Container>
      {status === "unauthenticated" || (!data?.user && redirect("/"))}

      {status === "authenticated" && (
        <main className="mt-7 p-4 rounded-md border-2 shadow-xl">
          <NewFinancialContributionForm />
        </main>
      )}
    </Container>
  );
};

export default CadastrarFinanca;
