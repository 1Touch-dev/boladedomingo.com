import { loadDeskFixtures } from "@/lib/deskFixtures";
import type { IFixture } from "@/types";
import type { IApiSuccessResponse } from "@/types/api";

const signed = async (): Promise<IApiSuccessResponse<IFixture[]>> => {
  const data = await loadDeskFixtures();
  return { success: true, message: "ok", data };
};

const matchesApis = {
  getAll: () => signed(),
  getByDate: async (date: string) => {
    const payload = await signed();
    const day = date.slice(0, 10);
    return {
      ...payload,
      data: (payload.data ?? []).filter((fixture) => fixture.startsAt.slice(0, 10) === day),
    };
  },
};

export default matchesApis;
