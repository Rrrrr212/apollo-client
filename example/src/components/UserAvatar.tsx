import { useQuery } from "@apollo/client/react";
import { GET_CURRENT_USER_QUERY } from "../graphql/queries/user";

export function UserAvatar() {
  const { loading, error, data } = useQuery(GET_CURRENT_USER_QUERY);

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error.message}</div>;
  if (!data?.currentUser) return <div>No user found</div>;

  const { currentUser } = data;

  return (
    <div className="user-avatar">
      <img src={currentUser.avatarUrl} alt={currentUser.name} className="avatar" />
      <span className="username">{currentUser.name}</span>
    </div>
  );
}
