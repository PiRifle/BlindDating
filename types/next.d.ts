import "next"

import { GetServerSidePropsContext } from "next/types";
import { Response, Request } from "express";
import { GetServerSidePropsResult } from "next/types";
interface Context<Q, D> extends GetServerSidePropsContext<Q, D> {
	req: Request;
	res: Response;
}
export type GetServerSidePropsExpress<
	P extends { [key: string]: any } = { [key: string]: any },
	Q extends ParsedUrlQuery = ParsedUrlQuery,
	D extends PreviewData = PreviewData
> = (context: Context<Q, D>) => Promise<GetServerSidePropsResult<P> | void>;

interface School {
	code: string;
	name: string;
	logo: string;
}
