"use client";

import Ratings from "@/components/ui/ratings";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import DetailCommentWrite from "./DetailCommentWrite";
import { MdOutlineEdit, MdClear } from "react-icons/md";
import { useState } from "react";
import { useMutation } from "@apollo/client";
import {
  DeleteCommentDocument,
  FetchCommentsDocument,
} from "@/commons/graphql/graphql";
import { useToast } from "@/components/hooks/use-toast";

export default function DetailCommentListItem({ el, editId, handleEditId }) {
  const { toast } = useToast();

  const [deleteComment] = useMutation(DeleteCommentDocument);
  const [isEdit, setIsEdit] = useState(false);

  const onClickEdit = (event) => {
    handleEditId(el._id);
    setIsEdit(editId === el._id); // Ensure `isEdit` updates based on the selected comment
  };
  const handleEdit = () => {
    setIsEdit(false);
    handleEditId(""); // Reset editId when done editing
  };
  // const handleEdit = () => {
  //   setIsEdit((prev) => !prev);
  // };

  const onClickDelete = async (event) => {
    // console.log(event.currentTarget.id);
    // try {
    //   const response = await deleteComment({
    //     variables: { boardCommentId: event.currentTarget.id },
    //     refetchQueries: [{ query: FetchCommentsDocument }],
    //   });
    //   console.log("response:", response.data?.deleteBoardComment);
    //   toast({
    //     description: "삭제에 성공하였습니다",
    //   });
    // } catch (error) {
    //   toast({
    //     description: "삭제에 실패하였습니다",
    //     variant: "destructive",
    //   });
    // }
  };

  return (
    <div key={el._id} className="flex flex-col gap-4">
      {editId === el._id || isEdit ? (
        <DetailCommentWrite isEdit={true} handleEdit={handleEdit} data={el} />
      ) : (
        <div className="flex flex-col gap-2">
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-2">
              <div className="flex items-center gap-1">
                <Avatar className="w-5 h-5">
                  <AvatarFallback>{el.writer}</AvatarFallback>
                </Avatar>
                <div className="prose-l_14_20 text-gray-700">{el.writer}</div>
              </div>
              <Ratings rating={el.rating} onRatingChange={() => {}} />
            </div>
            <div className="flex items-center group gap-2">
              <MdOutlineEdit color="#333333" onClick={onClickEdit} />
              <MdClear id={el._id} color="#333333" onClick={onClickDelete} />
            </div>
          </div>
          <div className="prose-r_16_24">{el.contents}</div>
          <div className="prose-r_14_20 text-[#818181]">
            {el.createdAt.slice(0, 10).replace(/-/g, ".")}
          </div>
        </div>
      )}
      {/* NOTE : 다시 보기 */}
      {/* {index !== last_idx && <hr />} */}
      <hr className="py-2" />
    </div>
  );
}
