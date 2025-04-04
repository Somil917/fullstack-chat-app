import { usePopupModal } from "@/hooks/usePopupModal";
import { useUserStore } from "@/stores/useUserStore";
import UsersContainer from "./UsersContainer";

const Sidebar = () => {
  const { onOpen } = usePopupModal();
  const { authUser } = useUserStore();

  return (
    <div className="w-fit sm:w-[25vw] border-r-2 h-screen border-gray-300">
      <div className="w-full border-b-2 border-gray-300 px-3 py-2 flex justify-between items-center">
        <h1 className="text-2xl hidden sm:flex font-semibold">Sendit</h1>
        <div
          onClick={onOpen}
          className="rounded-full border border-zinc-400 size-11 cursor-pointer overflow-hidden"
        >
          <img
            className="h-full w-full object-cover"
            src={authUser?.profilePic || "../public/avatar.png"}
            alt=""
          />
        </div>
      </div>
      <div className="">
        <UsersContainer />
      </div>
    </div>
  );
};

export default Sidebar;
