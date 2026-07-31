const emulationPathMarker = "/Emulation/";

function tokenizeCommand(command: string): string[]
{
	const tokens: string[] = [];
	let token = "";
	let quote: "'" | '"' | null = null;

	const finishToken = () =>
	{
		if (token.length > 0)
		{
			tokens.push(token);
			token = "";
		}
	};

	for (let index = 0; index < command.length; index++)
	{
		const character = command[index];

		if (quote)
		{
			if (character === quote)
			{
				quote = null;
			} else if (character === "\\" && command[index + 1] === quote)
			{
				token += command[++index];
			} else
			{
				token += character;
			}
		} else if (character === "'" || character === '"')
		{
			quote = character;
		} else if (/\s/.test(character))
		{
			finishToken();
		} else if (character === "\\" && command[index + 1] && /[\s'"\\]/.test(command[index + 1]))
		{
			token += command[++index];
		} else
		{
			token += character;
		}
	}

	finishToken();
	return tokens;
}

export function extractEmulationPaths(command: string): string[]
{
	const paths = new Set<string>();

	for (const token of tokenizeCommand(command))
	{
		const markerIndex = token.indexOf(emulationPathMarker);
		if (markerIndex === -1)
		{
			continue;
		}

		const pathStart = token.indexOf("/");
		if (pathStart !== -1 && pathStart <= markerIndex)
		{
			paths.add(token.slice(pathStart));
		}
	}

	return [...paths];
}
