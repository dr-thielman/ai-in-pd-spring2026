"""Abridged educational summary of 'Attention Is All You Need' for MP2 Part A."""

ATTENTION_PAPER_TEXT = """\
ATTENTION IS ALL YOU NEED — ABRIDGED EDUCATIONAL SUMMARY

The following is an abridged educational summary of: Vaswani, A., Shazeer, N., \
Parmar, N., Uszkoreit, J., Jones, L., Gomez, A.N., Kaiser, L., and Polosukhin, I. \
"Attention Is All You Need." Advances in Neural Information Processing Systems \
(NeurIPS), 2017. Read the full paper at https://arxiv.org/abs/1706.03762

This summary preserves key technical details and numerical results for educational \
use. It is not a verbatim reproduction of the original paper.

========================================
ABSTRACT
========================================

The dominant models for sequence-to-sequence tasks such as machine translation \
had traditionally been built on complex recurrent or convolutional neural networks \
arranged in an encoder-decoder configuration. The best-performing variants of these \
models also incorporated an attention mechanism to connect the encoder and decoder. \
This paper proposed a fundamentally new architecture called the Transformer, which \
is built solely on attention mechanisms and completely eliminates the need for \
recurrence and convolutions.

The authors demonstrated that this attention-only approach produces models that are \
not only higher quality but also far more parallelizable, requiring significantly \
less training time. On the WMT 2014 English-to-German translation benchmark, the \
Transformer achieved a BLEU score of 28.4, improving over the previous best results \
(including ensemble models) by more than 2 BLEU points. On the WMT 2014 \
English-to-French translation benchmark, the model established a new \
single-model state-of-the-art BLEU score of 41.8, after training for only 3.5 days \
on eight GPUs. This represented a small fraction of the training cost required by \
the previous best models. The authors further showed that the Transformer \
generalizes well to other tasks, applying it successfully to English constituency \
parsing with both large and limited training data.

========================================
INTRODUCTION AND MOTIVATION
========================================

Before the Transformer, recurrent neural networks — particularly Long Short-Term \
Memory networks (LSTMs) and Gated Recurrent Units (GRUs) — had been firmly \
established as the leading approaches for sequence modeling and transduction tasks \
like language modeling and machine translation. These architectures process sequences \
one element at a time: at each time step t, the model takes the current input and the \
previous hidden state h(t-1) to produce a new hidden state h(t). This sequential \
processing is fundamental to how recurrent networks work.

The problem with this sequential nature is that it prevents parallelization within \
individual training examples. Each step must wait for the previous step to complete \
before it can begin, because h(t) depends on h(t-1). As sequence lengths grow, this \
becomes a critical bottleneck. Memory constraints further limit how many sequences \
can be batched together during training. Researchers had made progress through \
factorization tricks and conditional computation to improve computational efficiency, \
but the fundamental constraint of sequential processing remained.

Attention mechanisms had already become an important part of sequence modeling, \
allowing models to capture dependencies between positions in a sequence regardless \
of their distance from each other. However, in nearly all prior work, attention was \
used alongside a recurrent network rather than as a replacement for it. The attention \
mechanism helped the recurrent model focus on relevant parts of the input, but the \
recurrent backbone still processed the sequence step by step.

The Transformer broke this paradigm entirely. Instead of using recurrence and \
adding attention on top, the authors proposed an architecture that relies entirely \
on attention mechanisms to model relationships between all positions in a sequence. \
By eliminating recurrence, the Transformer allows all positions in a sequence to be \
processed simultaneously, enabling massive parallelization during training. The \
paper demonstrated that this approach achieves superior translation quality while \
being trained in as little as twelve hours on eight NVIDIA P100 GPUs — dramatically \
faster than comparable recurrent models.

The key insight was that attention alone, without any recurrent or convolutional \
components, is sufficient to capture the relationships between words in a sequence. \
This was surprising because the conventional wisdom held that some form of sequential \
processing was necessary for understanding language, where word order and long-range \
dependencies are critical.

========================================
MODEL ARCHITECTURE OVERVIEW
========================================

The Transformer uses an encoder-decoder structure, which is common in \
sequence-to-sequence models. The encoder reads the input sequence (for example, a \
sentence in English) and produces a continuous representation of it. The decoder then \
generates the output sequence (for example, the translation in German) one element at \
a time, using the encoder's representation along with the previously generated output \
elements.

What makes the Transformer unique is how the encoder and decoder are built. Instead \
of recurrent layers, both use stacked layers of self-attention and feed-forward \
networks.

The encoder consists of a stack of N = 6 identical layers. Each layer contains two \
sub-layers. The first sub-layer is a multi-head self-attention mechanism, which \
allows each position in the sequence to attend to all other positions. The second \
sub-layer is a simple position-wise fully connected feed-forward network, which \
processes each position independently. Around each sub-layer, the model uses a \
residual connection (adding the sub-layer's input to its output) followed by layer \
normalization. The formula for this is: LayerNorm(x + Sublayer(x)). All sub-layers \
and embedding layers produce outputs of dimension d_model = 512, which ensures that \
residual connections can work (the dimensions must match for addition).

The decoder is also composed of a stack of N = 6 identical layers. It has the same \
two sub-layers as the encoder (self-attention and feed-forward), but adds a third \
sub-layer that performs multi-head attention over the encoder's output. This \
encoder-decoder attention allows each position in the decoder to look at all \
positions in the input sequence. The decoder's self-attention sub-layer is modified \
with masking to prevent positions from attending to future positions. This is \
essential because during generation, the model predicts one token at a time and \
should not have access to tokens that haven't been generated yet. The masking, \
combined with the output embeddings being offset by one position, ensures that the \
prediction for position i depends only on known outputs at positions less than i.

========================================
SCALED DOT-PRODUCT ATTENTION
========================================

The attention mechanism at the heart of the Transformer can be understood through \
three key concepts: queries (Q), keys (K), and values (V). An attention function \
maps a query and a set of key-value pairs to an output. The output is a weighted \
sum of the values, where the weight for each value is determined by a compatibility \
function between the query and the corresponding key.

Think of it like a search engine: the query is your search term, the keys are the \
index entries of all the documents, and the values are the actual document contents. \
The attention mechanism scores how well each key matches the query, then returns a \
weighted combination of the corresponding values — paying more attention to the \
values whose keys best match the query.

The specific form used in the Transformer is called Scaled Dot-Product Attention. \
Given queries and keys of dimension d_k and values of dimension d_v, the attention \
is computed as:

    Attention(Q, K, V) = softmax(Q * K^T / sqrt(d_k)) * V

Here is what each step does:
1. Compute Q * K^T: the dot product of queries with all keys gives a score for each \
query-key pair, measuring compatibility.
2. Divide by sqrt(d_k): this scaling factor prevents the dot products from growing \
too large in magnitude. Without scaling, when d_k is large, the dot products become \
very large, pushing the softmax function into regions where its gradients are \
extremely small (effectively saturating it). This would make learning very slow.
3. Apply softmax: convert the scaled scores into probabilities that sum to 1. Higher \
scores get exponentially more weight.
4. Multiply by V: produce the output as a weighted sum of the value vectors.

The authors chose dot-product attention over additive attention (which uses a small \
neural network to compute compatibility scores) because dot-product attention is \
much faster and more space-efficient in practice. It can be implemented using highly \
optimized matrix multiplication routines. While additive attention performs \
comparably for small key dimensions, scaled dot-product attention wins for the \
larger dimensions used in practice.

In implementation, the authors compute attention for all queries simultaneously by \
packing them into a matrix Q, with keys and values similarly packed into matrices \
K and V. This allows the entire attention computation to be expressed as matrix \
operations, which modern GPUs handle extremely efficiently.

========================================
MULTI-HEAD ATTENTION
========================================

Rather than computing a single attention function using the full d_model = 512 \
dimensional keys, values, and queries, the authors found it beneficial to split the \
computation into multiple parallel attention "heads." This is multi-head attention.

The idea is straightforward: instead of one attention computation, perform h = 8 \
parallel attention computations, each operating on a different learned linear \
projection of the queries, keys, and values. Specifically:
- Project Q, K, and V down from 512 dimensions to d_k = d_v = d_model/h = 64 \
dimensions using learned weight matrices
- Compute attention independently for each of the 8 heads
- Concatenate the 8 outputs (each 64-dimensional, giving 512 total)
- Apply a final linear projection to produce the output

The mathematical formulation is:
    MultiHead(Q, K, V) = Concat(head_1, ..., head_h) * W^O
    where head_i = Attention(Q * W_i^Q, K * W_i^K, V * W_i^V)

The key advantage of multi-head attention is that it allows the model to jointly \
attend to information from different representation subspaces at different positions. \
With a single attention head, the output at each position is an average over all \
attended positions, which tends to inhibit the model's ability to focus on multiple \
relevant pieces of information simultaneously. For example, when processing the \
word "it" in a sentence, one head might attend to the noun that "it" refers to, \
while another head attends to the verb that "it" is the subject of.

Because each head operates on reduced dimensionality (64 instead of 512), the total \
computational cost of multi-head attention is similar to that of single-head attention \
with the full dimensionality. The parallelism across heads is free from a compute \
perspective.

The Transformer uses multi-head attention in three different ways:
1. Encoder self-attention: In the encoder, queries, keys, and values all come from \
the output of the previous encoder layer. Each position in the encoder can attend to \
all positions in the previous layer, allowing the model to capture relationships \
between any pair of words in the input sentence.
2. Decoder self-attention (masked): In the decoder, self-attention works similarly, \
but with masking that prevents each position from attending to subsequent positions. \
This preserves the autoregressive property needed for generation.
3. Encoder-decoder attention: In the decoder, queries come from the previous decoder \
layer while keys and values come from the encoder output. This allows every position \
in the decoder to attend over all positions in the input sequence, similar to the \
attention mechanism used in traditional encoder-decoder architectures.

========================================
POSITION-WISE FEED-FORWARD NETWORKS
========================================

In addition to attention, each layer in both the encoder and decoder contains a \
position-wise fully connected feed-forward network. This network is applied \
independently and identically to each position in the sequence. It consists of two \
linear transformations with a ReLU activation in between:

    FFN(x) = max(0, x * W_1 + b_1) * W_2 + b_2

The inner layer has dimensionality d_ff = 2048, while the input and output \
dimensions are d_model = 512. Although the same function is applied at every \
position, the parameters (W_1, W_2, b_1, b_2) differ from layer to layer. This \
can also be described as two convolutions with kernel size 1. The feed-forward \
network gives the model the capacity to perform non-linear transformations on each \
position's representation independently, complementing the attention mechanism \
which mixes information across positions.

========================================
POSITIONAL ENCODING
========================================

Because the Transformer contains no recurrence and no convolution, it has no \
inherent mechanism for understanding the order of elements in a sequence. The word \
"dog bites man" and "man bites dog" would produce identical representations without \
some way to encode position information. To address this, the authors inject \
information about the position of each token in the sequence by adding positional \
encodings to the input embeddings at the bottom of both the encoder and decoder \
stacks.

The positional encodings have the same dimension d_model = 512 as the embeddings, \
so that the two can be added together (element-wise sum). The authors used sinusoidal \
functions of different frequencies to generate the positional encodings:

    PE(pos, 2i) = sin(pos / 10000^(2i/d_model))
    PE(pos, 2i+1) = cos(pos / 10000^(2i/d_model))

where pos is the position in the sequence and i is the dimension index. Each \
dimension of the positional encoding corresponds to a sinusoid with a different \
wavelength, forming a geometric progression from 2*pi to 10000*2*pi.

The authors chose sinusoidal functions because they hypothesized that this \
representation would allow the model to learn to attend by relative positions. For \
any fixed offset k, the positional encoding PE(pos+k) can be expressed as a linear \
function of PE(pos). This means the model can potentially learn to compute "the word \
3 positions to the left" as a simple linear operation on the positional encodings.

The authors also experimented with using learned positional embeddings (trainable \
vectors, one for each position) instead of the fixed sinusoidal encodings. The two \
approaches produced nearly identical results. They chose the sinusoidal version \
because it has the potential to extrapolate to sequence lengths longer than any seen \
during training, since the mathematical function is defined for any position value.

========================================
WHY SELF-ATTENTION
========================================

A natural question is: why use self-attention instead of recurrent or convolutional \
layers? The authors compared these approaches along three dimensions:

1. Computational complexity per layer: How much total computation does each layer \
require?
2. Parallelizable computation: How much of the computation can be done in parallel \
(measured as the minimum number of sequential operations)?
3. Maximum path length: What is the longest path a signal must travel between any two \
positions in the sequence? Shorter paths between any pair of positions make it easier \
to learn long-range dependencies.

The comparison (for a sequence of length n and representation dimension d):

Self-Attention:
- Complexity per layer: O(n^2 * d)
- Sequential operations: O(1) — all positions attend to all other positions in parallel
- Maximum path length: O(1) — any position can directly attend to any other position

Recurrent layers:
- Complexity per layer: O(n * d^2)
- Sequential operations: O(n) — must process the sequence step by step
- Maximum path length: O(n) — information from position 1 must pass through all \
intermediate hidden states to reach position n

Convolutional layers:
- Complexity per layer: O(k * n * d^2) where k is kernel size
- Sequential operations: O(1)
- Maximum path length: O(log_k(n)) — requires a stack of layers to connect distant \
positions

Self-attention connects every pair of positions in a single operation, giving a \
maximum path length of O(1). Recurrent layers require O(n) sequential steps for \
information to travel between distant positions. Convolutional layers need \
O(log_k(n)) stacked layers to achieve full connectivity. This short path length is a \
key advantage of self-attention for learning long-range dependencies.

In terms of raw computation, self-attention is faster than recurrence when the \
sequence length n is smaller than the representation dimension d. This is the typical \
case for most sentence-level tasks in machine translation, where sequences might be \
50-100 tokens long but representations are 512 dimensions. For very long sequences, \
the n^2 factor in self-attention becomes expensive, and the authors suggested a \
restricted variant where each position attends only to a local neighborhood of size r.

An additional benefit noted by the authors is that self-attention produces more \
interpretable models. When examining the attention distributions, individual \
attention heads clearly learn to perform different tasks. Some heads track syntactic \
structure, others handle coreference resolution (determining what "it" refers to), \
and others capture long-distance dependencies between verbs and their arguments.

========================================
TRAINING DETAILS
========================================

The Transformer was trained on standard machine translation benchmarks:

For English-to-German translation: the WMT 2014 dataset containing approximately \
4.5 million sentence pairs. Sentences were encoded using byte-pair encoding with a \
shared source-target vocabulary of approximately 37,000 tokens.

For English-to-French translation: the significantly larger WMT 2014 dataset \
containing approximately 36 million sentence pairs, with a vocabulary of 32,000 \
tokens using word-piece encoding.

Training was performed on a machine with 8 NVIDIA P100 GPUs. The base model was \
trained for approximately 100,000 steps (about 12 hours), with each training step \
processing batches of sentence pairs containing approximately 25,000 source tokens \
and 25,000 target tokens. The larger "big" model was trained for 300,000 steps \
(approximately 3.5 days).

The optimizer was Adam with beta_1 = 0.9, beta_2 = 0.98, and epsilon = 10^-9. A \
custom learning rate schedule was used that increases the learning rate linearly \
during a warmup period (4,000 steps for the base model), then decreases it \
proportionally to the inverse square root of the step number. This warmup prevents \
large updates early in training when the model parameters are still random.

Two forms of regularization were applied:
1. Residual dropout: Applied to the output of each sub-layer before it is added to \
the sub-layer input and normalized. Also applied to the sums of the embeddings and \
positional encodings. The dropout rate was P_drop = 0.1 for the base model and 0.3 \
for the big model.
2. Label smoothing: During training, label smoothing with value epsilon_ls = 0.1 was \
used. This technique replaces hard target labels (0 or 1) with smoothed values (e.g., \
0.9 for the correct class, distributing 0.1 across other classes). While this hurts \
perplexity (the model becomes less confident in its predictions), it improves \
accuracy and BLEU scores because it encourages the model to be less overconfident.

========================================
RESULTS
========================================

Machine Translation Results:

On the WMT 2014 English-to-German translation task, the big Transformer model \
achieved a BLEU score of 28.4. This surpassed all previously reported models, \
including ensembles of multiple models, by more than 2.0 BLEU points. This was a \
new state-of-the-art result. Even the smaller base Transformer model achieved 27.3 \
BLEU, outperforming all previously published single models and ensembles at a tiny \
fraction of their training cost.

On the WMT 2014 English-to-French translation task, the big Transformer achieved a \
BLEU score of 41.8, establishing a new single-model state-of-the-art. This was \
accomplished at less than one-quarter of the training cost of the previous best \
model. The base model achieved 38.1 BLEU on this task. For context, the previous \
state-of-the-art single models scored around 40.5 BLEU and required far more \
computational resources.

The training cost comparison is striking. The Transformer (big) required \
approximately 2.3 x 10^19 FLOPs for English-to-German, compared to 1.8 x 10^20 \
FLOPs for the best previous ensemble model — nearly an order of magnitude less \
computation for a better result.

Model Architecture Variation Experiments:

The authors conducted extensive experiments varying different aspects of the \
Transformer architecture to understand what matters:

Attention heads: Varying the number of attention heads while keeping total \
computation constant revealed that single-head attention is 0.9 BLEU worse than the \
best setting (8 heads). However, too many heads (32 heads with dimension 16 each) \
also degraded quality slightly. The sweet spot was around 8 heads with 64 dimensions \
each.

Attention key dimension: Reducing the attention key dimension d_k hurt model quality, \
suggesting that the compatibility function between queries and keys benefits from \
higher-dimensional representations. A more sophisticated compatibility function than \
simple dot product might help with smaller key dimensions.

Model size: As expected, larger models (more dimensions, more layers) performed \
better, up to the limits of what could be trained on the available hardware.

Dropout: Dropout was critical for avoiding overfitting. Without dropout, performance \
degraded significantly. A dropout rate of 0.1 worked well for the base model.

Positional encoding: Replacing sinusoidal positional encodings with learned positional \
embeddings produced nearly identical results, suggesting that the model is relatively \
insensitive to the exact form of positional information.

English Constituency Parsing:

To demonstrate that the Transformer generalizes beyond translation, the authors \
applied it to English constituency parsing (analyzing grammatical structure). With \
a 4-layer Transformer trained only on the Wall Street Journal portion of the Penn \
Treebank (about 40,000 sentences), the model achieved 91.3 F1 on the WSJ test set \
— better than all previous discriminative models except one, and without any \
task-specific architectural modifications. In a semi-supervised setting with \
additional data, the model reached 92.7 F1.

========================================
CONCLUSION
========================================

The Transformer was the first sequence transduction model built entirely on \
attention, replacing the recurrent layers that had been standard in encoder-decoder \
architectures with multi-headed self-attention. This design choice had profound \
consequences:

Training speed: The Transformer can be trained significantly faster than \
architectures based on recurrent or convolutional layers, because self-attention \
allows all positions to be processed in parallel. The 3.5-day training time for \
state-of-the-art translation results was dramatically less than previous approaches.

Translation quality: The model established new state-of-the-art results on both the \
English-to-German and English-to-French WMT 2014 benchmarks, with the English-to-German \
result surpassing even ensemble models despite using far less computation.

Generalizability: The architecture transferred successfully to constituency parsing \
without modification, suggesting that attention-based models are broadly applicable \
across sequence tasks.

The authors outlined several directions for future work: applying the Transformer to \
problems involving input and output modalities other than text (such as images, audio, \
and video), and investigating ways to make the generation process less sequential. \
They also suggested exploring local, restricted attention mechanisms for handling very \
long sequences efficiently.

Historical significance: Although the authors could not have known it at the time, \
the Transformer architecture became the foundation for virtually all subsequent \
breakthroughs in natural language processing. BERT (2018) used the Transformer \
encoder for bidirectional language understanding. GPT (2018) and its successors \
(GPT-2, GPT-3, GPT-4) used the Transformer decoder for autoregressive text \
generation. Every major large language model today — including Claude, GPT-4, Gemini, \
and Llama — is built on the Transformer architecture introduced in this paper. The \
attention mechanism described here is also the foundation of retrieval systems, \
including the RAG pipeline you are building in this notebook.
"""
