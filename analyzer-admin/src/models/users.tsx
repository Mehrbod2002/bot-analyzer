export interface UserModel {
  _id?: string;
  email: string;
  password: string;
  reset_token: string;
  reset_token_valid: Date;
  otp_valid: Date;
  retry_otp: number;
  created_at: Date;
  support_or_admin: boolean;
}

const forexSymbols = [
  "EURUSD", "GBPUSD", "USDJPY", "AEDUSD", "XAUUSD", "EURGBP", "EURJPY", "GBPJPY",
  "USDCAD", "CADCHF", "USDCHF", "CHFJPY", "EURCHF", "GBPCHF", "CADJPY", "EURCAD",
  "GBPCAD", "AUDUSD", "NZDUSD", "AUDCHF", "CHFPLN", "NZDCHF", "CHFSGD", "AUDCAD",
  "AUDJPY", "AUDNZD", "EURAUD", "EURNOK", "EURNZD", "EURSEK", "GBPAUD", "GBPNZD",
  "NZDCAD", "NZDJPY", "USDNOK", "USDSEK", "AUDDKK", "EURHUF", "EURMXN", "EURPLN",
  "EURTRK", "EURZAR", "GBPNOK", "GBPPLN", "GBPSEK", "NOKSEK", "PLNJPY", "USDMXN",
  "USDHUF", "USDPLN", "USDTRY", "USDZAR", "EURRUB", "USDRUB", "USDILS", "USDCNH",
  "GBPZAR", "AUDPLN", "AUDSGD", "EURSGD", "GBPSGD", "NZDSGD", "USDDKK", "SGDJPY",
  "USDSGD", "EURHKD", "GBPDKK", "USDHKD", "EURDKK", "EURCZK", "USDCZK", "USDTHB"
];

const cryptoSymbols = [
  "CARDANO", "BAT", "BITCOINCASH", "BITCOIN", "DOGECOIN", "POLKADOT", "DASH", "EOS",
  "ETHCLASSIC", "ETHEREUM", "FILECOIN", "IOTA", "CHAINLINK", "AAVE", "LITECOIN", "ZCASH",
  "POLYGON", "NEO", "SOLANA", "SUSHISWAP", "THETA", "TRON", "UNISWAP", "VECHAIN", "STELLAR",
  "MONERO", "XRP", "TEZOS"
];

const indexesSymbols = [];

const commoditiesSymbols = [
  "GOLD", "GOLDoz", "GOLDgr", "GOLDEURO", "SILVER", "SILVEREURO", "PLATINUM", "PALLADIUM",
  "ALUMINUM", "COPPER", "LEAD", "ZINC", "WTI", "BRENT", "NAT.GAS"
];

export const AllSymbols = [
  ...forexSymbols,
  ...cryptoSymbols,
  ...indexesSymbols,
  ...commoditiesSymbols
];

export interface Condition {
  number_count: number;
  has_flag: boolean;
  min_volumn: number;
}

export interface GeneralData {
  _id?: string;
  first_type: Condition;
  second_type: Condition;
  just_send_signal: boolean;
  sync_symbols: boolean;
  first_trade: number;
  first_trade_mode_is_amount: boolean;
  stop_limit: number;
  rounds: number;
  magic_number: number;
  from_time: string;
  to_time: string;
  compensate_rounds: number;
  make_position_when_not_round_closed: boolean;
  max_trade_volumn: number;
  max_loss_to_close_all: number;
  values_candels: string;
  diff_pip: string;
}