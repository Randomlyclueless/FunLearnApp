export class DictionaryService {
  static async getWordDefinition(word) {
    try {
      const response = await fetch(
        `https://api.dictionaryapi.dev/api/v2/entries/en/${word.toLowerCase()}`
      );

      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }

      const data = await response.json();

      if (
        data &&
        data.length > 0 &&
        data[0].meanings &&
        data[0].meanings.length > 0
      ) {
        return data[0].meanings[0].definitions[0].definition;
      }

      return "Definition not found";
    } catch (error) {
      console.error("Failed to fetch word definition:", error);
      return "Could not fetch definition";
    }
  }
}
