import Container from "@/app/components/container";
import NewFinancialContributionForm from "../components/newFinancialContributionForm";

const CadastrarFinanca = () => {
  return (
    <Container>
      <main className="mt-7 p-4 rounded-md border-2 shadow-xl">
        <NewFinancialContributionForm />
      </main>
    </Container>
  );
};

export default CadastrarFinanca;
