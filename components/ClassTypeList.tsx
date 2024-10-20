/* eslint-disable camelcase */
"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

import HomeCard from "./HomeCard";
import { Call, useStreamVideoClient } from "@stream-io/video-react-sdk";
import { useUser } from "@clerk/nextjs";
import Loader from "./Loader";
import { Textarea } from "./ui/textarea";
import ReactDatePicker from "react-datepicker";
import { useToast } from "@/hooks/use-toast";
import ClassModal from "./ClassModal";
import { Input } from "./ui/input";

const initialValues = {
  dateTime: new Date(),
  description: "",
  link: "",
};

const MeetingTypeList = () => {
  const router = useRouter();
  const [meetingState, setMeetingState] = useState<
    "isScheduleMeeting" | "isJoiningMeeting" | "isInstantMeeting" | undefined
  >(undefined);
  const [values, setValues] = useState(initialValues);
  const [callDetail, setCallDetail] = useState<Call>();
  const client = useStreamVideoClient();
  const { user } = useUser();
  const { toast } = useToast();

  const createMeeting = async () => {
    if (!client || !user) return;
    try {
      if (!values.dateTime) {
        toast({ title: "Please select a date and time" });
        return;
      }
      const id = crypto.randomUUID();
      const call = client.call("default", id);
      if (!call) throw new Error("Failed to create meeting");
      const startsAt =
        values.dateTime.toISOString() || new Date(Date.now()).toISOString();
      const description = values.description || "Instant Meeting";
      await call.getOrCreate({
        data: {
          starts_at: startsAt,
          custom: {
            description,
          },
        },
      });
      setCallDetail(call);
      if (!values.description) {
        router.push(`/meeting/${call.id}`);
      }
      toast({
        title: "Class Created",
      });
    } catch (error) {
      console.error(error);
      toast({ title: "Failed to create Class" });
    }
  };

  if (!client || !user) return <Loader />;

  const meetingLink = `${process.env.NEXT_PUBLIC_BASE_URL}/meeting/${callDetail?.id}`;

  return (
    <section className="grid grid-cols-1 gap-5 md:grid-cols-2 xl:grid-cols-4">
      <HomeCard
        img="/icons/add-meeting.svg"
        title="New Class"
        descriptipon="Start an instant Class"
        handleClick={() => setMeetingState("isInstantMeeting")}
      />
      <HomeCard
        img="/icons/join-meeting.svg"
        title="Join Class"
        descriptipon="via invitation link"
        className="bg-blue-1"
        handleClick={() => setMeetingState("isJoiningMeeting")}
      />
      <HomeCard
        img="/icons/schedule.svg"
        title="Schedule Class"
        descriptipon="Plan your Class"
        className="bg-purple-1"
        handleClick={() => setMeetingState("isScheduleMeeting")}
      />
      <HomeCard
        img="/icons/recordings.svg"
        title="View Recordings"
        descriptipon="Lecture Recordings"
        className="bg-yellow-1"
        handleClick={() => router.push("/recordings")}
      />

      {!callDetail ? (
        <ClassModal
          isOpen={meetingState === "isScheduleMeeting"}
          onClose={() => setMeetingState(undefined)}
          title="Create Class"
          handleClick={createMeeting}
        >
          <div className="flex flex-col gap-2.5">
            <label className="text-base font-normal leading-[22.4px] text-sky-2">
              Add a description
            </label>
            <Textarea
              className="border-none bg-dark-3 focus-visible:ring-0 focus-visible:ring-offset-0"
              onChange={(e) =>
                setValues({ ...values, description: e.target.value })
              }
            />
          </div>
          <div className="flex w-full flex-col gap-2.5">
            <label className="text-base font-normal leading-[22.4px] text-sky-2">
              Select Date and Time
            </label>
            <ReactDatePicker
              selected={values.dateTime}
              onChange={(date) => setValues({ ...values, dateTime: date! })}
              showTimeSelect
              timeFormat="HH:mm"
              timeIntervals={15}
              timeCaption="time"
              dateFormat="MMMM d, yyyy h:mm aa"
              className="w-full rounded bg-dark-3 p-2 focus:outline-none"
            />
          </div>
        </ClassModal>
      ) : (
        <ClassModal
          isOpen={meetingState === "isScheduleMeeting"}
          onClose={() => setMeetingState(undefined)}
          title="Class Created"
          handleClick={() => {
            navigator.clipboard.writeText(meetingLink);
            toast({ title: "Link Copied" });
          }}
          image={"/icons/checked.svg"}
          buttonIcon="/icons/copy.svg"
          className="text-center"
          buttonText="Copy Class Link"
        />
      )}

      <ClassModal
        isOpen={meetingState === "isJoiningMeeting"}
        onClose={() => setMeetingState(undefined)}
        title="Type the link here"
        className="text-center"
        buttonText="Join Class"
        handleClick={() => router.push(values.link)}
      >
        <Input
          placeholder="Class link"
          onChange={(e) => setValues({ ...values, link: e.target.value })}
          className="border-none bg-dark-3 focus-visible:ring-0 focus-visible:ring-offset-0"
        />
      </ClassModal>

      <ClassModal
        isOpen={meetingState === "isInstantMeeting"}
        onClose={() => setMeetingState(undefined)}
        title="Start an Instant Class"
        className="text-center"
        buttonText="Start Class"
        handleClick={createMeeting}
      />
    </section>
  );
};

export default MeetingTypeList;

// "use client";
// import React, { useState } from "react";
// import HomeCard from "./HomeCard";
// import { useRouter } from "next/navigation";
// import ClassModal from "./ClassModal";
// import { useUser } from "@clerk/nextjs";
// import { Call, useStreamVideoClient } from "@stream-io/video-react-sdk";
// import { useToast } from "@/hooks/use-toast";
// import { Textarea } from "./ui/textarea";
// import DatePicker from "react-datepicker";

// const ClassTypeList = () => {
//   const { toast } = useToast();
//   const router = useRouter();
//   const [meetingState, setMeetingState] = useState<
//     "isScheduleMeeting" | "isJoiningMeeting" | "isInstantMeeting" | undefined
//   >(undefined);

//   const { user } = useUser();
//   const client = useStreamVideoClient();
//   const [values, setValues] = useState({
//     dateTime: new Date(),
//     description: "",
//     link: "",
//   });

//   const [callDetails, setCallDetails] = useState<Call>();
//   const createMeeting = async () => {
//     if (!client || !user) return;

//     try {
//       if (!values.dateTime) {
//         toast({
//           title: "Please Select Date and Time",
//         });
//         return;
//       }
//       const id = crypto.randomUUID();
//       const call = client.call("default", id);
//       if (!call) throw new Error("Failed to make a call");

//       const startsAt =
//         values.dateTime.toISOString() || new Date(Date.now()).toISOString();
//       const description = values.description || "Instant Meeting";

//       await call.getOrCreate({
//         data: {
//           starts_at: startsAt,
//           custom: {
//             description,
//           },
//         },
//       });
//       setCallDetails(call);
//       if (!values.description) {
//         router.push(`/meeting/${call.id}`);
//       }
//       toast({
//         title: "Class Created",
//       });
//     } catch (error) {
//       console.log(error);
//       toast({
//         title: "Failed to Create Class",
//       });
//     }
//   };
//   const meetingLink = `${process.env.NEXT_PUBLIC_BASE_URL}/meeting/${callDetails?.id}`;
//   return (
//     <section className="grid grid-cols-1 gap-5 md:grid-cols-2 xl:grid-cols-4">
//       <HomeCard
//         img="/icons/add-meeting.svg"
//         title="New Class"
//         descriptipon="Start an instant Class"
//         className="bg-orange-1"
//         handleClick={() => setMeetingState("isInstantMeeting")}
//       />
//       <HomeCard
//         img="/icons/join-meeting.svg"
//         title="Join Class"
//         descriptipon="via invitation link"
//         className="bg-blue-1"
//         handleClick={() => setMeetingState("isJoiningMeeting")}
//       />
//       <HomeCard
//         img="/icons/schedule.svg"
//         title="Schedule Class"
//         descriptipon="Plan your Class"
//         className="bg-purple-1"
//         handleClick={() => setMeetingState("isScheduleMeeting")}
//       />
//       <HomeCard
//         img="/icons/recordings.svg"
//         title="View Recordings"
//         descriptipon="Class Recordings"
//         className="bg-yellow-1"
//         handleClick={() => router.push("/recordings")}
//       />
//       {!callDetails ? (
//         <ClassModal
//           isOpen={meetingState === "isScheduleMeeting"}
//           onClose={() => setMeetingState(undefined)}
//           title="Create Class"
//           handleClick={createMeeting}
//         >
//           <div className="flex flex-col gap-2.5 ">
//             <label className="text-base text-normal leading-[22px] text-sky-3">
//               Add Class Name or Course Code
//             </label>
//             <Textarea
//               className="border-none bg-dark-3 focus-visible:ring-0 focus-visible:ring-offset-0"
//               onChange={(e) => {
//                 setValues({ ...values, description: e.target.value });
//               }}
//             />
//           </div>
//           <div className="flex w-full flex-col gap-2.5">
//             <label className="text-base text-normal leading-[22px]">
//               Select Date and Time
//             </label>
//             <DatePicker
//               selected={values.dateTime}
//               onChange={(date) => setValues({ ...values, dateTime: date! })}
//               showTimeSelect
//               timeFormat="HH:mm"
//               timeIntervals={15}
//               timeCaption="time"
//               dateFormat="MMMM d, yyyy h:m aa"
//               className="w-full bg-dark-3 p-2 focus:outline-none"
//             />
//           </div>
//         </ClassModal>
//       ) : (
//         <ClassModal
//           isOpen={meetingState === "isScheduleMeeting"}
//           onClose={() => setMeetingState(undefined)}
//           title="Class Created"
//           className="text-center"
//           handleClick={() => {
//             navigator.clipboard.writeText(meetingLink);
//             toast({ title: "Link copied" });
//           }}
//           image="/icons/checked.svg"
//           buttonIcon="/icons/copy.svg"
//           buttonText="Copy class link"
//         />
//       )}
//       <ClassModal
//         isOpen={meetingState === "isInstantMeeting"}
//         onClose={() => setMeetingState(undefined)}
//         title="Create an Instant Class"
//         className="text-center"
//         buttonText="Start Class"
//         handleClick={createMeeting}
//       />
//     </section>
//   );
// };

// export default ClassTypeList;
