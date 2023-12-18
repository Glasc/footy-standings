import { z } from "zod";
import { createTRPCRouter, publicProcedure } from "~/server/api/trpc";

export type clubSuggestion = z.infer<typeof ClubSuggestionSchema>;
const ClubSuggestionSchema = z.object({
  id: z.string(),
  url: z.string(),
  name: z.string(),
  country: z.string(),
  squad: z.string(),
  marketValue: z.string(),
});

type Player = {
  id: string;
  name: string;
  position: string;
  dateOfBirth: string;
  age: string;
  nationality: string[];
  height: string; 
  foot: string;
  joinedOn: string;
  signedFrom: string;
  contract: string;
  marketValue: string;
};

export const clubRouter = createTRPCRouter({
  getPlayer: publicProcedure.query(async () => {
    // put this api token on the call: 751ddc3dc2694d309edd516feee59721
    const club = "arsenal";
    const response = await fetch(
      `https://transfermarkt-api-kappa.vercel.app/clubs/search/${club}?page_number=1`,
      {
        headers: {
          accept: "application/json",
        },
      },
    );

    const clubs = (await response.json()) as {
      results: clubSuggestion[];
    };
  }),
  getClubsSuggestions: publicProcedure
    .input(z.object({ club: z.string() }))
    .query(async ({ input }) => {
      // put this api token on the call: 751ddc3dc2694d309edd516feee59721
      const response = await fetch(
        `https://transfermarkt-api-kappa.vercel.app/clubs/search/${input.club}?page_number=1`,
        {
          headers: {
            accept: "application/json",
          },
        },
      );
      const clubs = (await response.json()) as {
        results: clubSuggestion[];
      };

      return clubs;
    }),
  getClubDetails: publicProcedure
    .input(z.object({ id: z.string() }))
    .query(async ({ input }) => {
      const response = await fetch(
        `https://transfermarkt-api-kappa.vercel.app/clubs/${input.id}/players`,
        {
          headers: {
            accept: "application/json",
          },
        },
      );
      const clubDetails = (await response.json()) as {
        players: Player[]
      };
      return clubDetails;
    }),
});
