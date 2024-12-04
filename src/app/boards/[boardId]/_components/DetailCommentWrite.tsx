"use client";
import React, { useEffect, useRef, useState } from "react";

import NewFormText from "@/app/boards/new/_components/NewFormText";
import { Button } from "@/components/ui/button";
import Ratings from "@/components/ui/ratings";
import "@/app/boards/new/styles.css";
import { MdOutlineComment } from "react-icons/md";
import { CREATE_COMMENT, FETCH_COMMENTS } from "@/app/queries/comments-queries";
import {
  CreateCommentDocument,
  FetchCommentsDocument,
  UpdateCommentDocument,
} from "@/commons/graphql/graphql";
import { useMutation } from "@apollo/client";
import { useToast } from "@/components/hooks/use-toast";
import { useParams } from "next/navigation";

export default function DetailCommentWrite({
  boardId,
  isEdit,
  handleEdit,
  data,
}: IDeteailCommentProps) {
  const { toast } = useToast();
  const [createComment] = useMutation(CreateCommentDocument);
  const [updateComment] = useMutation(UpdateCommentDocument);
  const params = useParams();
  const id = params.boardId;

  const [input, setInput] = useState<ICommentInput>(
    !isEdit
      ? {
          author: "",
          password: "",
          comment: "",
          rating: 0,
        }
      : {
          author: data.writer,
          password: "",
          comment: data.contents,
          rating: data.rating,
        }
  );
  const handleRatingChange = (newRating: number) => {
    setInput((prev) => ({ ...prev, rating: newRating }));
  };

  const onChangeInput = (
    event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setInput((prev) => ({ ...prev, [event.target.id]: event.target.value }));
  };

  const onClickSubmit = async () => {
    try {
      console.log("댓글 등록 쿼리 실행");
      const result = await createComment({
        variables: {
          boardId: boardId,
          createBoardCommentInput: {
            writer: input.author,
            password: input.password,
            contents: input.comment,
            rating: input.rating,
          },
        },
        refetchQueries: [
          {
            query: FetchCommentsDocument,
            variables: { page: 1, boardId: id },
          },
        ],
      });
      console.log("댓글 등록 성공", result);
      setInput({ author: "", password: "", comment: "", rating: 0 });
    } catch (error) {
      console.log("댓글 등록 오류", error);
    }
  };

  const isDisabled = !(input.author && input.password);

  const onClickUpdate = async () => {
    const updateInput = {
      contents: input.comment,
      rating: input.rating,
    };
    try {
      const result = await updateComment({
        variables: {
          updateBoardCommentInput: updateInput,
          password: input.password,
          boardCommentId: data._id,
        },
        refetchQueries: [
          { query: FetchCommentsDocument, variables: { page: 1, boardId: id } },
        ],
      });
      handleEdit();
      toast({
        description: "수정이 완료되었습니다",
      });
    } catch (error) {
      console.log("댓글 수정 오류:", error);
      toast({
        description: "비밀번호가 일치하지 않습니다",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center gap-2 prose-sb_18_24">
        <MdOutlineComment />
        댓글
      </div>
      <div>
        <Ratings rating={input.rating} onRatingChange={handleRatingChange} />
      </div>
      <div className="flex flex-col gap-4">
        <div className="flex items-center gap-4 w-full max-w-[640px]">
          <NewFormText
            title={"author"}
            onChange={onChangeInput}
            value={input.author}
            disabled={isEdit && true}
          />
          <NewFormText
            title={"password"}
            onChange={onChangeInput}
            value={input.password}
          />
        </div>
        <NewFormText
          title={"comment"}
          onChange={onChangeInput}
          value={input.comment}
        />
      </div>
      <div className="flex justify-end prose-sb_16_24">
        <Button
          className=""
          variant={"blue"}
          disabled={isDisabled}
          onClick={isEdit ? onClickUpdate : onClickSubmit}
        >
          댓글 등록
        </Button>
      </div>
    </div>
  );
}
