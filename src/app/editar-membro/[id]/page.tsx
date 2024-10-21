"use client";
import Container from "../../components/container";
import MemberForm from "../../components/memberForm";

interface EditMemberProps {
  params: {
    id: string;
  };
}

const EditMember = ({ params }: EditMemberProps) => {
  return (
    <Container>
      <MemberForm memberId={params.id} />
    </Container>
  );
};

export default EditMember;
