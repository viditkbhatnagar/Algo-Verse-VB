import type { GlossaryTermData } from "@/lib/visualization/types";

export const nlpTerms: GlossaryTermData[] = [
  {
    slug: "natural-language-processing",
    name: "Natural Language Processing",
    definition:
      "A field of artificial intelligence focused on enabling computers to understand, interpret, and generate human language. NLP combines techniques from linguistics, computer science, and machine learning to bridge the gap between human communication and machine understanding. Applications include chatbots, translation, and search engines.",
    relatedTerms: ["tokenization", "language-model", "transformer", "text-classification", "word-embedding"],
    category: "nlp",
    tags: ["fundamentals", "ai", "linguistics"],
  },
  {
    slug: "tokenization",
    name: "Tokenization",
    definition:
      "The process of splitting raw text into smaller units called tokens, such as words, subwords, or characters. Tokenization is typically the very first step in any NLP pipeline because models cannot process raw strings directly. The choice of tokenization strategy significantly affects model performance and vocabulary size.",
    relatedTerms: ["token", "subword-tokenization", "bpe", "sentencepiece", "vocabulary"],
    category: "nlp",
    tags: ["preprocessing", "fundamentals", "text-processing"],
  },
  {
    slug: "token",
    name: "Token",
    definition:
      "A single unit of text produced by the tokenization process, which can be a word, subword, character, or punctuation mark. Tokens are the atomic inputs that NLP models operate on. The number of tokens in a text determines the computational cost of processing it through a model.",
    relatedTerms: ["tokenization", "vocabulary", "subword-tokenization", "bpe"],
    category: "nlp",
    tags: ["fundamentals", "text-processing"],
  },
  {
    slug: "vocabulary",
    name: "Vocabulary",
    definition:
      "The complete set of unique tokens that an NLP model recognizes and can process. Tokens not in the vocabulary are typically marked as unknown or broken into subword pieces. Vocabulary size is a critical design choice: too small leads to many unknown tokens, while too large increases model size and training time.",
    relatedTerms: ["token", "tokenization", "subword-tokenization", "bpe", "sentencepiece"],
    category: "nlp",
    tags: ["fundamentals", "model-design"],
  },
  {
    slug: "corpus",
    name: "Corpus",
    definition:
      "A large, structured collection of text documents used for training or evaluating NLP models. A corpus can be domain-specific (e.g., medical texts) or general-purpose (e.g., Wikipedia). The quality, size, and diversity of the training corpus directly impact the capabilities and biases of the resulting model.",
    relatedTerms: ["vocabulary", "language-model", "tf-idf", "bag-of-words"],
    category: "nlp",
    tags: ["data", "fundamentals", "training"],
  },
  {
    slug: "stopword",
    name: "Stopword",
    definition:
      "A commonly used word (such as 'the', 'is', 'and', 'in') that is often filtered out during text preprocessing because it carries little meaningful content on its own. Removing stopwords can reduce noise and improve the efficiency of models like TF-IDF and bag of words. However, modern deep learning models like BERT typically keep stopwords because they carry grammatical information.",
    relatedTerms: ["tokenization", "tf-idf", "bag-of-words", "text-classification"],
    category: "nlp",
    tags: ["preprocessing", "text-processing"],
  },
  {
    slug: "stemming",
    name: "Stemming",
    definition:
      "A text normalization technique that reduces words to their root or base form by chopping off suffixes using simple heuristic rules. For example, 'running', 'runs', and 'runner' might all be reduced to 'run'. Stemming is fast but can produce non-real words (e.g., 'studi' from 'studies') since it does not consider the word's context or part of speech.",
    relatedTerms: ["lemmatization", "tokenization", "stopword", "bag-of-words"],
    category: "nlp",
    tags: ["preprocessing", "text-normalization"],
  },
  {
    slug: "lemmatization",
    name: "Lemmatization",
    definition:
      "A text normalization technique that reduces words to their dictionary base form (lemma) by considering the word's part of speech and morphological analysis. Unlike stemming, lemmatization always produces valid words (e.g., 'better' becomes 'good', 'ran' becomes 'run'). It is more accurate but slower than stemming.",
    relatedTerms: ["stemming", "part-of-speech-tagging", "tokenization", "stopword"],
    category: "nlp",
    tags: ["preprocessing", "text-normalization"],
  },
  {
    slug: "part-of-speech-tagging",
    name: "Part-of-Speech Tagging",
    definition:
      "The task of assigning grammatical labels (noun, verb, adjective, etc.) to each word in a sentence based on its context and role. POS tagging is a fundamental NLP task that helps downstream applications like parsing, named entity recognition, and lemmatization. Modern POS taggers use neural networks and achieve over 97% accuracy on standard benchmarks.",
    relatedTerms: ["named-entity-recognition", "lemmatization", "tokenization", "text-classification"],
    category: "nlp",
    tags: ["sequence-labeling", "linguistics", "fundamentals"],
  },
  {
    slug: "named-entity-recognition",
    name: "Named Entity Recognition",
    definition:
      "An NLP task that identifies and classifies named entities in text into predefined categories such as person names, organizations, locations, dates, and monetary values. NER is essential for information extraction and is used in search engines, chatbots, and content analysis. It is typically modeled as a sequence labeling problem.",
    relatedTerms: ["part-of-speech-tagging", "text-classification", "information-retrieval", "transformer"],
    category: "nlp",
    tags: ["sequence-labeling", "information-extraction"],
  },
  {
    slug: "sentiment-analysis",
    name: "Sentiment Analysis",
    definition:
      "The task of determining the emotional tone or opinion expressed in a piece of text, typically classifying it as positive, negative, or neutral. Sentiment analysis is widely used in brand monitoring, product reviews, and social media analysis. It can be performed at the document, sentence, or aspect level using rule-based or machine learning approaches.",
    relatedTerms: ["text-classification", "fine-tuning-nlp", "bert", "transfer-learning-nlp"],
    category: "nlp",
    tags: ["classification", "applications"],
  },
  {
    slug: "text-classification",
    name: "Text Classification",
    definition:
      "The task of assigning one or more predefined categories or labels to a given text document. Examples include spam detection, topic labeling, and sentiment analysis. Text classification can be performed using traditional methods like TF-IDF with logistic regression or modern approaches using fine-tuned transformer models.",
    relatedTerms: ["sentiment-analysis", "tf-idf", "bag-of-words", "bert", "fine-tuning-nlp"],
    category: "nlp",
    tags: ["classification", "supervised-learning", "applications"],
  },
  {
    slug: "word-embedding",
    name: "Word Embedding",
    definition:
      "A learned representation that maps words to dense, low-dimensional vectors of real numbers, capturing semantic relationships between words. Words with similar meanings end up close together in the vector space. Word embeddings are a foundational technique in modern NLP and replaced older sparse representations like one-hot encoding.",
    formula: "Each word $w$ is mapped to a vector $\\mathbf{v}_w \\in \\mathbb{R}^d$, where $d$ is typically 50–300",
    relatedTerms: ["word2vec", "glove", "fasttext", "cosine-similarity", "semantic-similarity"],
    category: "nlp",
    tags: ["representation", "vectors", "fundamentals"],
  },
  {
    slug: "word2vec",
    name: "Word2Vec",
    definition:
      "A group of shallow neural network models developed by Google that learn word embeddings from large text corpora. Word2Vec comes in two architectures: Skip-gram (predicts context words given a target word) and CBOW (predicts a target word from context words). It popularized the idea that vector arithmetic captures semantic relationships, such as king - man + woman ≈ queen.",
    formula: "Skip-gram objective: $\\max \\frac{1}{T} \\sum_{t=1}^{T} \\sum_{-c \\le j \\le c, j \\neq 0} \\log P(w_{t+j} | w_t)$",
    relatedTerms: ["word-embedding", "glove", "fasttext", "cosine-similarity"],
    category: "nlp",
    tags: ["representation", "neural-network", "unsupervised"],
  },
  {
    slug: "glove",
    name: "GloVe",
    definition:
      "Global Vectors for Word Representation — an unsupervised learning algorithm developed at Stanford that generates word embeddings by factorizing the word co-occurrence matrix of a corpus. Unlike Word2Vec, which learns from local context windows, GloVe combines global statistical information with local context, often producing high-quality embeddings for analogy tasks.",
    formula: "Objective: $\\sum_{i,j=1}^{V} f(X_{ij})(\\mathbf{w}_i^T \\tilde{\\mathbf{w}}_j + b_i + \\tilde{b}_j - \\log X_{ij})^2$",
    relatedTerms: ["word-embedding", "word2vec", "fasttext", "cosine-similarity"],
    category: "nlp",
    tags: ["representation", "unsupervised", "matrix-factorization"],
  },
  {
    slug: "fasttext",
    name: "FastText",
    definition:
      "A word embedding and text classification library developed by Facebook AI Research that extends Word2Vec by representing each word as a bag of character n-grams. This allows FastText to generate embeddings for out-of-vocabulary words by composing their subword representations. It is particularly useful for morphologically rich languages.",
    relatedTerms: ["word2vec", "word-embedding", "glove", "subword-tokenization", "n-gram"],
    category: "nlp",
    tags: ["representation", "subword", "classification"],
  },
  {
    slug: "tf-idf",
    name: "TF-IDF",
    definition:
      "Term Frequency–Inverse Document Frequency — a numerical statistic that reflects how important a word is to a document within a collection. TF measures how frequently a term appears in a document, while IDF reduces the weight of terms that appear in many documents. TF-IDF is widely used in information retrieval and text classification as a feature extraction method.",
    formula: "$\\text{TF-IDF}(t, d) = \\text{TF}(t, d) \\times \\log\\frac{N}{\\text{DF}(t)}$, where $N$ is the total number of documents and $\\text{DF}(t)$ is the number of documents containing term $t$",
    relatedTerms: ["bag-of-words", "information-retrieval", "text-classification", "stopword"],
    category: "nlp",
    tags: ["feature-extraction", "statistics", "information-retrieval"],
  },
  {
    slug: "bag-of-words",
    name: "Bag of Words",
    definition:
      "A simple text representation method that models a document as an unordered set (bag) of its words, disregarding grammar and word order but keeping track of word frequency. Each document is represented as a vector whose length equals the vocabulary size, with each entry being the count or presence of that word. BoW is easy to implement but loses all sequential and contextual information.",
    relatedTerms: ["tf-idf", "n-gram", "vocabulary", "word-embedding", "text-classification"],
    category: "nlp",
    tags: ["feature-extraction", "representation", "simple"],
  },
  {
    slug: "n-gram",
    name: "N-gram",
    definition:
      "A contiguous sequence of n items (words, characters, or tokens) from a given text. Unigrams (n=1) are single words, bigrams (n=2) are pairs, and trigrams (n=3) are triples. N-grams capture local word order and co-occurrence patterns, and are used in language models, text classification, and spell checking.",
    formula: "An n-gram language model estimates: $P(w_n | w_1, \\ldots, w_{n-1}) \\approx P(w_n | w_{n-N+1}, \\ldots, w_{n-1})$",
    relatedTerms: ["language-model", "bag-of-words", "perplexity", "tokenization"],
    category: "nlp",
    tags: ["fundamentals", "language-modeling", "statistics"],
  },
  {
    slug: "language-model",
    name: "Language Model",
    definition:
      "A probabilistic model that assigns probabilities to sequences of words, effectively learning the structure and patterns of a language. Language models can predict the next word in a sequence, generate coherent text, and serve as the foundation for tasks like translation and summarization. Modern language models such as GPT are based on the transformer architecture.",
    formula: "$P(w_1, w_2, \\ldots, w_n) = \\prod_{i=1}^{n} P(w_i | w_1, \\ldots, w_{i-1})$",
    relatedTerms: ["perplexity", "n-gram", "transformer", "gpt", "bert", "masked-language-model"],
    category: "nlp",
    tags: ["fundamentals", "generation", "probability"],
  },
  {
    slug: "perplexity",
    name: "Perplexity",
    definition:
      "A standard metric for evaluating language models that measures how well the model predicts a sample of text. Lower perplexity indicates better prediction — the model is less 'surprised' by the text. Intuitively, a perplexity of k means the model is as uncertain as if it had to choose uniformly among k options at each step.",
    formula: "$\\text{PP}(W) = P(w_1, w_2, \\ldots, w_N)^{-1/N} = 2^{H(W)}$, where $H(W)$ is the cross-entropy",
    relatedTerms: ["language-model", "n-gram", "bleu-score"],
    category: "nlp",
    tags: ["evaluation", "metrics", "language-modeling"],
  },
  {
    slug: "bleu-score",
    name: "BLEU Score",
    definition:
      "Bilingual Evaluation Understudy — a metric for evaluating the quality of machine-generated text by comparing it to one or more reference translations. BLEU computes the precision of n-gram matches between the candidate and reference texts and applies a brevity penalty. Scores range from 0 to 1, with higher values indicating closer matches to human references.",
    formula: "$\\text{BLEU} = \\text{BP} \\cdot \\exp\\left(\\sum_{n=1}^{N} w_n \\log p_n\\right)$, where $p_n$ is modified n-gram precision and BP is the brevity penalty",
    relatedTerms: ["machine-translation", "perplexity", "n-gram", "text-generation"],
    category: "nlp",
    tags: ["evaluation", "metrics", "translation"],
  },
  {
    slug: "attention-mechanism",
    name: "Attention Mechanism",
    definition:
      "A neural network component that allows a model to focus on the most relevant parts of the input when producing each part of the output. Instead of compressing the entire input into a fixed-size vector, attention computes a weighted sum over all input positions, with weights reflecting their relevance. It was originally introduced for machine translation and later became the cornerstone of the transformer architecture.",
    formula: "$\\text{Attention}(Q, K, V) = \\text{softmax}\\left(\\frac{QK^T}{\\sqrt{d_k}}\\right)V$",
    relatedTerms: ["self-attention", "multi-head-attention", "transformer", "sequence-to-sequence"],
    category: "nlp",
    tags: ["architecture", "neural-network", "fundamentals"],
  },
  {
    slug: "self-attention",
    name: "Self-Attention",
    definition:
      "A special case of the attention mechanism where the query, key, and value vectors all come from the same input sequence, allowing each position to attend to every other position. Self-attention enables the model to capture dependencies regardless of their distance in the sequence. It is the core operation inside transformer blocks.",
    formula: "$\\text{SelfAttn}(X) = \\text{softmax}\\left(\\frac{(XW^Q)(XW^K)^T}{\\sqrt{d_k}}\\right)(XW^V)$",
    relatedTerms: ["attention-mechanism", "multi-head-attention", "transformer", "positional-encoding"],
    category: "nlp",
    tags: ["architecture", "transformer", "neural-network"],
  },
  {
    slug: "multi-head-attention",
    name: "Multi-Head Attention",
    definition:
      "An extension of the attention mechanism that runs multiple attention operations (heads) in parallel, each with different learned projection matrices. The outputs of all heads are concatenated and linearly transformed. Multi-head attention allows the model to jointly attend to information from different representation subspaces at different positions.",
    formula: "$\\text{MultiHead}(Q,K,V) = \\text{Concat}(\\text{head}_1, \\ldots, \\text{head}_h)W^O$, where each $\\text{head}_i = \\text{Attention}(QW_i^Q, KW_i^K, VW_i^V)$",
    relatedTerms: ["self-attention", "attention-mechanism", "transformer", "encoder", "decoder"],
    category: "nlp",
    tags: ["architecture", "transformer", "neural-network"],
  },
  {
    slug: "transformer",
    name: "Transformer",
    definition:
      "A neural network architecture introduced in the 'Attention Is All You Need' paper that relies entirely on self-attention mechanisms instead of recurrence or convolution. Transformers process all positions in parallel, making them highly efficient to train on modern hardware. They are the foundation of virtually all state-of-the-art NLP models including BERT, GPT, and T5.",
    relatedTerms: ["self-attention", "multi-head-attention", "encoder", "decoder", "positional-encoding", "bert", "gpt"],
    category: "nlp",
    tags: ["architecture", "deep-learning", "fundamentals"],
  },
  {
    slug: "encoder",
    name: "Encoder",
    definition:
      "The component of a sequence-to-sequence or transformer model that processes the input sequence and produces a set of continuous representations (hidden states). In the original transformer, the encoder consists of a stack of identical layers, each containing multi-head self-attention and a feed-forward network. Encoder-only models like BERT are used for tasks that require understanding the full input.",
    relatedTerms: ["decoder", "transformer", "sequence-to-sequence", "bert", "self-attention"],
    category: "nlp",
    tags: ["architecture", "transformer", "neural-network"],
  },
  {
    slug: "decoder",
    name: "Decoder",
    definition:
      "The component of a sequence-to-sequence or transformer model that generates the output sequence one token at a time, attending to both its own previous outputs and the encoder's representations. In the transformer, the decoder uses masked self-attention to prevent attending to future positions. Decoder-only models like GPT are used for text generation tasks.",
    relatedTerms: ["encoder", "transformer", "sequence-to-sequence", "gpt", "beam-search", "greedy-decoding"],
    category: "nlp",
    tags: ["architecture", "transformer", "neural-network"],
  },
  {
    slug: "sequence-to-sequence",
    name: "Sequence-to-Sequence",
    definition:
      "A model architecture that maps a variable-length input sequence to a variable-length output sequence, typically using an encoder-decoder structure. Seq2seq models are used for machine translation, summarization, and dialogue generation. The original seq2seq used RNNs, but modern implementations use transformers for superior performance.",
    relatedTerms: ["encoder", "decoder", "attention-mechanism", "machine-translation", "beam-search"],
    category: "nlp",
    tags: ["architecture", "generation", "translation"],
  },
  {
    slug: "beam-search",
    name: "Beam Search",
    definition:
      "A decoding strategy that explores multiple candidate output sequences simultaneously by keeping the top-k (beam width) most probable partial sequences at each step. Unlike greedy decoding which only keeps the single best token, beam search can find higher-probability complete sequences by considering a broader search space. It is widely used in machine translation and text generation.",
    relatedTerms: ["greedy-decoding", "decoder", "sequence-to-sequence", "language-model", "text-generation"],
    category: "nlp",
    tags: ["decoding", "search", "generation"],
  },
  {
    slug: "greedy-decoding",
    name: "Greedy Decoding",
    definition:
      "The simplest decoding strategy for autoregressive text generation, where at each time step the token with the highest probability is selected. Greedy decoding is fast and deterministic but can produce suboptimal sequences because choosing the locally best token at each step does not guarantee the globally best sequence. It often leads to repetitive or generic outputs.",
    relatedTerms: ["beam-search", "decoder", "text-generation", "language-model"],
    category: "nlp",
    tags: ["decoding", "generation", "simple"],
  },
  {
    slug: "masked-language-model",
    name: "Masked Language Model",
    definition:
      "A pre-training objective where some percentage of input tokens are randomly replaced with a special [MASK] token, and the model learns to predict the original tokens from context. This bidirectional training strategy was introduced by BERT and allows the model to learn deep contextual representations by considering both left and right context simultaneously.",
    relatedTerms: ["bert", "language-model", "transformer", "encoder", "fine-tuning-nlp"],
    category: "nlp",
    tags: ["pre-training", "self-supervised", "fundamentals"],
  },
  {
    slug: "bert",
    name: "BERT",
    definition:
      "Bidirectional Encoder Representations from Transformers — a pre-trained language model developed by Google that learns deep bidirectional representations by jointly conditioning on both left and right context using the masked language model objective. BERT revolutionized NLP by establishing the pre-train then fine-tune paradigm and achieving state-of-the-art results across many benchmarks.",
    relatedTerms: ["masked-language-model", "transformer", "encoder", "fine-tuning-nlp", "transfer-learning-nlp"],
    category: "nlp",
    tags: ["model", "pre-trained", "encoder", "google"],
  },
  {
    slug: "gpt",
    name: "GPT",
    definition:
      "Generative Pre-trained Transformer — a family of autoregressive language models developed by OpenAI that use a decoder-only transformer architecture. GPT models are pre-trained on massive text corpora using a next-token prediction objective and can generate coherent, contextually relevant text. The GPT family includes GPT-2, GPT-3, GPT-4, and their variants.",
    relatedTerms: ["transformer", "decoder", "language-model", "fine-tuning-nlp", "prompt-engineering", "text-generation"],
    category: "nlp",
    tags: ["model", "pre-trained", "decoder", "openai", "generation"],
  },
  {
    slug: "fine-tuning-nlp",
    name: "Fine-Tuning (NLP)",
    definition:
      "The process of taking a pre-trained language model (like BERT or GPT) and further training it on a smaller, task-specific dataset to adapt it for a particular application. Fine-tuning adjusts the model's weights to specialize in the target task while retaining the general language understanding learned during pre-training. It is far more efficient than training a model from scratch.",
    relatedTerms: ["bert", "gpt", "transfer-learning-nlp", "zero-shot-learning", "few-shot-learning"],
    category: "nlp",
    tags: ["training", "transfer-learning", "practical"],
  },
  {
    slug: "prompt-engineering",
    name: "Prompt Engineering",
    definition:
      "The practice of designing and refining the input text (prompt) given to a large language model to elicit the desired output. Effective prompts can include instructions, examples, and formatting cues that guide the model's behavior. Prompt engineering is a key skill for working with models like GPT and enables zero-shot and few-shot learning without modifying model weights.",
    relatedTerms: ["gpt", "zero-shot-learning", "few-shot-learning", "language-model", "text-generation"],
    category: "nlp",
    tags: ["practical", "generation", "technique"],
  },
  {
    slug: "zero-shot-learning",
    name: "Zero-Shot Learning",
    definition:
      "The ability of a model to perform a task it was never explicitly trained on, by leveraging its general language understanding and the task description provided in the prompt. For example, a language model can classify sentiment without any labeled examples by being prompted with 'Is this review positive or negative?'. Zero-shot learning demonstrates the generalization power of large pre-trained models.",
    relatedTerms: ["few-shot-learning", "prompt-engineering", "transfer-learning-nlp", "gpt"],
    category: "nlp",
    tags: ["learning-paradigm", "generalization"],
  },
  {
    slug: "few-shot-learning",
    name: "Few-Shot Learning",
    definition:
      "A learning approach where the model is given a small number of labeled examples (typically 1–10) in the prompt to help it understand the task, without updating its weights. Few-shot learning bridges the gap between zero-shot (no examples) and full fine-tuning (many examples). It was popularized by GPT-3, which demonstrated remarkable few-shot performance across diverse tasks.",
    relatedTerms: ["zero-shot-learning", "prompt-engineering", "fine-tuning-nlp", "gpt", "transfer-learning-nlp"],
    category: "nlp",
    tags: ["learning-paradigm", "practical"],
  },
  {
    slug: "transfer-learning-nlp",
    name: "Transfer Learning (NLP)",
    definition:
      "A machine learning strategy where a model pre-trained on a large general corpus is adapted to a specific downstream task, transferring the language knowledge it already acquired. In NLP, this typically involves pre-training a transformer on a huge text dataset and then fine-tuning on task-specific data. Transfer learning dramatically reduced the data and compute needed for NLP tasks.",
    relatedTerms: ["fine-tuning-nlp", "bert", "gpt", "zero-shot-learning", "few-shot-learning"],
    category: "nlp",
    tags: ["training", "technique", "fundamentals"],
  },
  {
    slug: "positional-encoding",
    name: "Positional Encoding",
    definition:
      "A mechanism that injects information about the position of each token in the sequence into the model, since transformers have no built-in notion of order (unlike RNNs). The original transformer uses fixed sinusoidal functions of different frequencies, while newer models often learn the positional encodings during training. Without positional encoding, a transformer would treat 'dog bites man' and 'man bites dog' identically.",
    formula: "$PE_{(pos,2i)} = \\sin(pos / 10000^{2i/d})$, $PE_{(pos,2i+1)} = \\cos(pos / 10000^{2i/d})$",
    relatedTerms: ["transformer", "self-attention", "encoder", "decoder"],
    category: "nlp",
    tags: ["architecture", "transformer", "encoding"],
  },
  {
    slug: "subword-tokenization",
    name: "Subword Tokenization",
    definition:
      "A tokenization strategy that splits words into smaller meaningful units (subwords) rather than treating each word as an atomic token. This approach handles rare and out-of-vocabulary words by decomposing them into known subword pieces. Common algorithms include BPE, WordPiece, and SentencePiece. Subword tokenization balances vocabulary size with the ability to represent any text.",
    relatedTerms: ["tokenization", "bpe", "sentencepiece", "vocabulary", "fasttext"],
    category: "nlp",
    tags: ["preprocessing", "tokenization", "technique"],
  },
  {
    slug: "bpe",
    name: "BPE (Byte Pair Encoding)",
    definition:
      "A data compression algorithm adapted for NLP that iteratively merges the most frequent pair of adjacent characters or tokens in the training corpus to build a subword vocabulary. BPE starts with individual characters and greedily merges pairs until the desired vocabulary size is reached. It is used by GPT-2, GPT-3, and many other modern language models.",
    relatedTerms: ["subword-tokenization", "sentencepiece", "tokenization", "vocabulary", "gpt"],
    category: "nlp",
    tags: ["tokenization", "algorithm", "preprocessing"],
  },
  {
    slug: "sentencepiece",
    name: "SentencePiece",
    definition:
      "A language-independent, unsupervised text tokenizer and detokenizer developed by Google that treats the input as a raw stream of Unicode characters without requiring pre-tokenization or language-specific rules. SentencePiece supports both BPE and unigram language model tokenization methods. It is used by models like T5, ALBERT, and XLNet.",
    relatedTerms: ["bpe", "subword-tokenization", "tokenization", "vocabulary"],
    category: "nlp",
    tags: ["tokenization", "tool", "preprocessing"],
  },
  {
    slug: "cosine-similarity",
    name: "Cosine Similarity",
    definition:
      "A metric that measures the similarity between two vectors by computing the cosine of the angle between them, ranging from -1 (opposite) to 1 (identical direction). In NLP, cosine similarity is the standard way to compare word embeddings, sentence embeddings, or document representations. Two texts with similar meaning will have embedding vectors that point in nearly the same direction.",
    formula: "$\\cos(\\mathbf{A}, \\mathbf{B}) = \\frac{\\mathbf{A} \\cdot \\mathbf{B}}{\\|\\mathbf{A}\\| \\, \\|\\mathbf{B}\\|}$",
    relatedTerms: ["semantic-similarity", "word-embedding", "word2vec", "tf-idf"],
    category: "nlp",
    tags: ["metrics", "similarity", "vectors"],
  },
  {
    slug: "semantic-similarity",
    name: "Semantic Similarity",
    definition:
      "The degree to which two pieces of text convey the same meaning, regardless of their surface-level wording. For example, 'The cat sat on the mat' and 'A feline was resting on the rug' are semantically similar despite using different words. Semantic similarity is typically measured using cosine similarity between embedding vectors and is fundamental to search, question answering, and duplicate detection.",
    relatedTerms: ["cosine-similarity", "word-embedding", "sentence-embedding", "information-retrieval"],
    category: "nlp",
    tags: ["similarity", "representation", "applications"],
  },
  {
    slug: "text-generation",
    name: "Text Generation",
    definition:
      "The task of producing coherent and contextually relevant text given some input (a prompt, a question, or a context). Text generation models are typically autoregressive, predicting one token at a time based on all previously generated tokens. Applications include creative writing, code generation, chatbots, and data augmentation. Decoding strategies like beam search and sampling control output quality.",
    relatedTerms: ["language-model", "gpt", "decoder", "beam-search", "greedy-decoding"],
    category: "nlp",
    tags: ["generation", "applications", "autoregressive"],
  },
  {
    slug: "machine-translation",
    name: "Machine Translation",
    definition:
      "The task of automatically translating text from one natural language to another, such as English to French. Modern machine translation systems use neural sequence-to-sequence models with attention mechanisms, achieving near-human quality for many language pairs. Challenges include handling idiomatic expressions, preserving meaning, and translating between low-resource languages.",
    relatedTerms: ["sequence-to-sequence", "attention-mechanism", "encoder", "decoder", "bleu-score", "beam-search"],
    category: "nlp",
    tags: ["applications", "translation", "sequence-to-sequence"],
  },
  {
    slug: "question-answering",
    name: "Question Answering",
    definition:
      "An NLP task where the model receives a question (and optionally a context passage) and produces an answer. Extractive QA selects a span from the passage, while generative QA produces an answer in the model's own words. Question answering is a key benchmark for reading comprehension and is used in search engines, virtual assistants, and customer support systems.",
    relatedTerms: ["bert", "transformer", "information-retrieval", "text-classification", "fine-tuning-nlp"],
    category: "nlp",
    tags: ["applications", "comprehension"],
  },
  {
    slug: "summarization",
    name: "Summarization",
    definition:
      "The task of condensing a longer text into a shorter version while preserving the key information and overall meaning. Extractive summarization selects the most important sentences from the original text, while abstractive summarization generates new sentences that capture the essence. Modern summarization systems use transformer models and are evaluated with metrics like ROUGE.",
    relatedTerms: ["sequence-to-sequence", "transformer", "text-generation", "encoder", "decoder"],
    category: "nlp",
    tags: ["applications", "generation", "comprehension"],
  },
  {
    slug: "information-retrieval",
    name: "Information Retrieval",
    definition:
      "The task of finding relevant documents or passages from a large collection in response to a user's query. IR systems power search engines and recommendation systems. Traditional approaches use TF-IDF and BM25 for keyword matching, while modern neural IR uses dense embeddings and semantic similarity to capture meaning beyond exact word matches.",
    relatedTerms: ["tf-idf", "cosine-similarity", "semantic-similarity", "question-answering"],
    category: "nlp",
    tags: ["applications", "search", "ranking"],
  },
];
