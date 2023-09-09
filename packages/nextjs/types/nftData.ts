type TokenId = number;
type Address = string;
type TokenURI = string;

interface JSONManifest {
  name: string;
  description: string;
  attributes: Array<{
    trait_type: string;
    value: string;
  }>;
  image: string;
}

export interface NFTData extends JSONManifest {
  id: TokenId;
  uri: TokenURI;
  owner: Address;
}
