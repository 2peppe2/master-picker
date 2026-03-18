import DeveloperCard from "./DeveloperCard";

const DevelopersSection = () => (
  <div className="flex flex-col lg:flex-row lg:col-span-2 w-full gap-6 h-full">
    <DeveloperCard
      name="Petrus Jarl"
      description="People First. God Always. Code cool stuff!"
      imageSrc="/profile/petrus.png"
      githubUrl="https://github.com/2peppe2"
      linkedinUrl="https://www.linkedin.com/in/petrus-jarl-3697b5261/"
    />
    <DeveloperCard
      name="Mikael Karlsson"
      description="Hope you are doing good! Remember that you can learn anything :D"
      imageSrc="/profile/mikael.png"
      githubUrl="https://github.com/BakuPlayz"
      linkedinUrl="https://www.linkedin.com/in/mikael-karlsson-8212a91b1/"
    />
  </div>
);

export default DevelopersSection;
