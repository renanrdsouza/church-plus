import Image from "next/image";

const Home = () => {
  return (
    <main>
      <div className="flex flex-col justify-center items-center h-[calc(100vh-64px)]">
        <h1 className="md:text-3xl text-2xl text-center">
          Bem-vindo ao Church Plus
        </h1>
        <Image
          src="/logo_transparent.png"
          width={500}
          height={300}
          alt="logo Church plus"
        />
      </div>
    </main>
  );
};

export default Home;
