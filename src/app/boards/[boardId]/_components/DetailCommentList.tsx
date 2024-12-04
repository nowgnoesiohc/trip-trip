"use client";

import {
  DELETE_COMMENT,
  FETCH_COMMENTS,
  UPDATE_COMMENT,
} from "@/app/queries/comments-queries";
import { useMutation, useQuery } from "@apollo/client";
import InfiniteScroll from "react-infinite-scroll-component";

import DetailCommentListItem from "./DetailCommentListItem";
import { useEffect, useState } from "react";
import { warnOptionHasBeenMovedOutOfExperimental } from "next/dist/server/config";

export default function DetailCommentList({ boardId }: IDeteailCommentProps) {
  const [hasMore, setHasMore] = useState(true);
  const [editId, setEditId] = useState("");
  const deleteComment = useMutation(DELETE_COMMENT);
  const updateComment = useMutation(UPDATE_COMMENT);
  const fetchScale = 10;

  const { data, fetchMore } = useQuery(FETCH_COMMENTS, {
    variables: { page: 1, boardId: boardId },
  });

  // console.log(data);

  const handleEditId = (id: string) => {
    setEditId((prevId) => (prevId === id ? "" : id));
  };

  const handleDeleteComment = () => {};
  const handleEditComment = () => {};

  useEffect(() => {
    setHasMore(true);
  }, [data]);

  const onNext = () => {
    fetchMore({
      variables: { page: Math.ceil(dataLength / fetchScale) + 1 },
      updateQuery: (prev, { fetchMoreResult }) => {
        console.log("료이키텐카이", fetchMoreResult);
        if (fetchMoreResult.fetchBoardComments.length === 0) {
          console.log("마지막 입니다");
          setHasMore(false);
          return { fetchBoardComments: [...(prev.fetchBoardComments || [])] };
        }
        console.log(Math.ceil(dataLength / fetchScale) + 1, fetchMoreResult);
        return {
          fetchBoardComments: [
            ...(prev.fetchBoardComments || []),
            ...fetchMoreResult.fetchBoardComments,
          ],
        };
      },
    });
  };
  const dataLength = data?.fetchBoardComments.length ?? 10;

  return (
    <InfiniteScroll
      next={onNext}
      hasMore={hasMore}
      dataLength={dataLength}
      loader={
        <div className="py-2 text-center text-gray-400">로딩중입니다...</div>
      }
      endMessage={
        <div className="py-2 text-center text-gray-400">
          {dataLength === 0 ? "댓글이 없습니다" : "로딩중입니다"}
        </div>
      }
    >
      {data?.fetchBoardComments.map((el: IComment, idx: number) => (
        <DetailCommentListItem
          key={el._id}
          el={el}
          editId={editId}
          handleEditId={handleEditId}
        />
      ))}
    </InfiniteScroll>
  );
}
