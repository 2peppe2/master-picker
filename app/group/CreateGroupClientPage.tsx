"use client";

import CreateGroupActionCard from "./components/CreateGroupActionCard";
import CreateGroupBenefits from "./components/CreateGroupBenefits";
import GroupPageShell from "./components/GroupPageShell";
import { useRouter } from "next/navigation";
import { FC, useEffect, useState, useTransition } from "react";

const GROUP_ID_ALPHABET =
  "23456789ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz";
const GROUP_ID_LENGTH = 10;

const createGroupId = () => {
  const bytes = crypto.getRandomValues(new Uint8Array(GROUP_ID_LENGTH));

  return Array.from(
    bytes,
    (byte) => GROUP_ID_ALPHABET[byte % GROUP_ID_ALPHABET.length],
  ).join("");
};

const CreateGroupClientPage: FC = () => {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [groupId, setGroupId] = useState("");

  useEffect(() => {
    setGroupId(createGroupId());
  }, []);

  const handleCreateGroup = () => {
    if (!groupId) {
      return;
    }

    startTransition(() => {
      router.push(`/group/${groupId}`);
    });
  };

  return (
    <GroupPageShell>
      <div className="grid w-full gap-8 lg:grid-cols-[1.1fr_0.9fr] lg:items-center">
        <CreateGroupBenefits />
        <CreateGroupActionCard
          isPending={isPending}
          isDisabled={!groupId || isPending}
          onCreateGroup={handleCreateGroup}
        />
      </div>
    </GroupPageShell>
  );
};

export default CreateGroupClientPage;
