import { Reaction, ReactionCanHandleOptions, ReactionHandleOptions } from './reaction';
import { CheckRunPayload } from '../../schemas/github/check-run-payload';

export class CheckRun extends Reaction<CheckRunPayload> {
	canHandle({ event, payload }: ReactionCanHandleOptions<CheckRunPayload>): boolean {
		return event === 'check_run' && payload.check_run.status === 'completed';
	}

	getStreamLabsMessage({ payload }: ReactionHandleOptions<CheckRunPayload>): string {
		const {
			check_run: { conclusion },
			repository: { full_name: repositoryFullName },
		} = payload;

		if (conclusion === 'failure') {
			return `The build for *${repositoryFullName}* just failed 🙃`;
		}

		if (conclusion === 'success') {
			return `*${repositoryFullName}* built successfully ✨!`;
		}

		return `The build for *${repositoryFullName}* finished with state: 🌰 *${conclusion}*`;
	}

	getTwitchChatMessage({ payload }: ReactionHandleOptions<CheckRunPayload>): string {
		const {
			check_run: { conclusion, html_url: resultUrl },
			repository: { full_name: repositoryFullName },
		} = payload;

		if (conclusion === 'failure') {
			return `/me The build for ${repositoryFullName} just failed 🙃. See ${resultUrl} for details.`;
		}

		if (conclusion === 'success') {
			return `/me ${repositoryFullName} built successfully ✨!`;
		}

		return `/me The build for ${repositoryFullName} finished with state: 🌰 ${conclusion}. See ${resultUrl} for details.`;
	}
}
