WITH

erc20 as

(SELECT
        coalesce(in_erc20.num_in_tx_erc20,0) + coalesce(out_erc20.num_out_tx_erc20,0) as num_tx_erc20,
        in_erc20.wallet,
        in_erc20.num_in_tx_erc20,
        in_erc20.num_distinct_tokens_in,
        in_erc20.num_distinct_wallets_in,
        in_erc20.num_distinct_blocks_in,
        out_erc20.num_out_tx_erc20,
        out_erc20.num_distinct_tokens_out,
        out_erc20.num_distinct_wallets_out,
        out_erc20.num_distinct_blocks_out,
        in_erc20.min_block_number_in,
        in_erc20.max_block_number_in,
        out_erc20.min_block_number_out,
        out_erc20.max_block_number_out
FROM
(SELECT
        to_address as wallet,
        count(*) as num_in_tx_erc20,
        count(distinct token_address) as num_distinct_tokens_in,
        count(distinct from_address) as num_distinct_wallets_in,
        count(distinct block_number) as num_distinct_blocks_in,
        min(block_number) as min_block_number_in,
        max(block_number) as max_block_number_in
FROM `bigquery-public-data.ethereum_blockchain.token_transfers`
GROUP BY to_address) AS in_erc20
LEFT JOIN
(SELECT
        from_address as wallet,
        count(*) as num_out_tx_erc20,
        count(distinct token_address) as num_distinct_tokens_out,
        count(distinct to_address) as num_distinct_wallets_out,
        count(distinct block_number) as num_distinct_blocks_out,
        min(block_number) as min_block_number_out,
        max(block_number) as max_block_number_out
FROM `bigquery-public-data.ethereum_blockchain.token_transfers`
GROUP BY from_address) AS out_erc20
ON in_erc20.wallet = out_erc20.wallet)

,

eth AS

(SELECT

        in_eth.wallet,
        coalesce(in_eth.num_in_tx,0) + coalesce(out_eth.num_out_tx,0) as num_tx_eth,
        coalesce(in_eth.vol_in,0) + coalesce(out_eth.vol_out,0) as balance_eth,
        in_eth.num_in_tx,
        in_eth.num_distinct_wallets_in,
        in_eth.vol_in,
        in_eth.mean_in,
        in_eth.min_in,
        in_eth.max_in,
        in_eth.num_distinct_blocks_in,
        out_eth.num_out_tx,
        out_eth.num_distinct_wallets_out,
        out_eth.vol_out,
        out_eth.mean_out,
        out_eth.min_out,
        out_eth.max_out,
        out_eth.num_distinct_blocks_out,
        in_eth.min_block_number_in,
        in_eth.max_block_number_in,
        out_eth.min_block_number_out,
        out_eth.max_block_number_out

FROM

(SELECT
        to_address as wallet,
        count(*) as num_in_tx,
        count(distinct from_address) as num_distinct_wallets_in,
        sum(value / POW(10, 18)) as vol_in,
        avg(value / POW(10, 18)) as mean_in,
        min(value / POW(10, 18)) as min_in,
        max(value / POW(10, 18)) as max_in,
        count(distinct block_number) as num_distinct_blocks_in,
        min(block_number) as min_block_number_in,
        max(block_number) as max_block_number_in
FROM `bigquery-public-data.ethereum_blockchain.transactions`
GROUP BY to_address) AS in_eth

LEFT JOIN

(SELECT
        from_address as wallet,
        count(*) as num_out_tx,
        count(distinct to_address) as num_distinct_wallets_out,
        sum(value / POW(10, 18)) as vol_out,
        avg(value / POW(10, 18)) as mean_out,
        min(value / POW(10, 18)) as min_out,
        max(value / POW(10, 18)) as max_out,
        count(distinct block_number) as num_distinct_blocks_out,
        min(block_number) as min_block_number_out,
        max(block_number) as max_block_number_out
FROM `bigquery-public-data.ethereum_blockchain.transactions`
GROUP BY from_address) AS out_eth
ON in_eth.wallet = out_eth.wallet)

,

all_wallets AS

(
SELECT 
coalesce(eth.wallet, erc20.wallet) as wallet,
num_tx_erc20,
erc20.num_in_tx_erc20,
erc20.num_distinct_tokens_in,
erc20.num_distinct_wallets_in as num_distinct_wallets_in_erc20,
erc20.num_distinct_blocks_in as num_distinct_blocks_in_erc20,
erc20.num_out_tx_erc20,
erc20.num_distinct_tokens_out,
erc20.num_distinct_wallets_out as num_distinct_wallets_out_erc20,
erc20.num_distinct_blocks_out as num_distinct_blocks_out_erc20,
erc20.min_block_number_in as min_block_number_in_erc20,
erc20.max_block_number_in as max_block_number_in_erc20,
erc20.min_block_number_out as min_block_number_out_erc20,
erc20.max_block_number_out as max_block_number_out_erc20,
num_tx_eth,
balance_eth,
eth.num_in_tx,
eth.num_distinct_wallets_in,
eth.vol_in,
eth.mean_in,
eth.min_in,
eth.max_in,
eth.num_distinct_blocks_in,
eth.num_out_tx,
eth.num_distinct_wallets_out,
eth.vol_out,
eth.mean_out,
eth.min_out,
eth.max_out,
eth.num_distinct_blocks_out,
eth.min_block_number_in as min_block_number_in_eth,
eth.max_block_number_in as max_block_number_in_eth,
eth.min_block_number_out as min_block_number_out_eth,
eth.max_block_number_out as max_block_number_out_eth
FROM eth
FULL OUTER JOIN erc20
ON eth.wallet = erc20.wallet
)

SELECT 
*
FROM all_wallets;