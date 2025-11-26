import { MainSection } from "./_components/mainSection";

interface DetailPageProps {
  params: {
    id: string;
  }
}

const DetailPage = async ({ params }: DetailPageProps) => {
  const { id } = await params;
  return (
    <div>
      <MainSection id={id} />
    </div>
  )
}

export default DetailPage