export type GTPmodelOptions = { model?: 'yandex' | 'sber' };

export type GPTRequest = {
  // model?: 'yandex' | 'sber';
  token: string;
  systemPrompt: string;
  userPrompt: string;
};

export type GPTRequestWithModel = Omit<GPTRequest, 'token'> & GTPmodelOptions;

export type EmbeddingsRequest = {
  submodel?: 'doc' | 'query';
  token: string;
  text: string;
};
export type EmbeddingsRequestWithModel = Omit<EmbeddingsRequest, 'token'> &
  GTPmodelOptions;

export type YandexRequest = {
  modelUri: string;
  completionOptions: yandexCompletionOptions;
  messages?: yandexMessage[];
};

type yandexCompletionOptions = {
  stream: boolean;
  temperature: number;
  maxTokens: string;
};

type yandexMessage = {
  role: 'system' | 'user' | 'assistant';
  text: string;
};
