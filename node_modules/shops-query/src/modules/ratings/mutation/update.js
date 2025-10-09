import { gql, client } from '../../../utils/apolloClient.js';

const EDIT_REVIEW = gql`
  mutation EditReview($id: Int!, $input: RatingInput!) {
    editReview(id: $id, input: $input) {
      id
      rating
      review
    }
  }
`;

export async function UPDATE_REVIEW(id, input) {
  const { data } = await client.mutate({
    mutation: EDIT_REVIEW,
    variables: { id, input },
  });
  return data.editReview;
}
