import {
  configureChains,
  createConfig,
  useAccount,
  WagmiConfig,
  useDisconnect,
  useConnect,
  useBalance,
  useNetwork,
  useBlockNumber,
  useContractEvent,
  useContractReads,
  usePrepareContractWrite,
  useContractWrite,
  useSwitchNetwork,
  useEnsAddress,
  useEnsAvatar,
  useEnsName,
  useEnsResolver,
  useFeeData,
  useSendTransaction,
  usePrepareSendTransaction,
  useSignMessage,
  useSignTypedData,
} from "wagmi";
import { Address, parseEther } from "viem";
import { mainnet } from "wagmi/chains";
import { polygonMumbai } from "./utils/configChains";
import { DataverseConnector } from "@dataverse/adapt-to-wagmi";
import { publicProvider } from "wagmi/providers/public";
import {
  abi1,
  abi2,
  contractAddress1,
  contractAddress2,
  domain,
  ensName,
  message,
  types,
} from "./constants";
import {
  Layout,
  RenderObjectRecursively,
} from "./components/RenderObjectRecursively";
import "./App.scss";
import { useEffect, useState } from "react";
import {
  SYSTEM_CALL,
  DataverseConnector as _DataverseConnector,
} from "@dataverse/dataverse-connector";

const { chains, publicClient } = configureChains(
  [mainnet, polygonMumbai],
  [publicProvider()]
);

const dataverseConnector = new DataverseConnector({ chains });

const _dataverseConnector = new _DataverseConnector();

const config = createConfig({
  autoConnect: true,
  connectors: [dataverseConnector],
  publicClient,
});

function Wagmi() {
  return (
    <WagmiConfig config={config}>
      <Profile />
    </WagmiConfig>
  );
}

function Profile() {
  const { connect } = useConnect({
    connector: dataverseConnector,
  });
  const { address, isConnected } = useAccount();
  const [pkh, setPKH] = useState("");
  const { chain } = useNetwork();
  const { switchNetworkAsync, switchNetwork } = useSwitchNetwork();

  const { data: balance, refetch: refetchBalance } = useBalance({
    address,
    chainId: chain?.id,
    enabled: true,
  });

  const { data: blockNumber, refetch: refetchBlockNumber } = useBlockNumber();

  useContractEvent({
    address: contractAddress1,
    abi: abi1,
    eventName: "NewOwner",
    listener(log) {
      console.log(log);
    },
  });

  const { data: contractRead, refetch: refetchContractRead } = useContractReads(
    {
      contracts: [
        {
          address: contractAddress2,
          abi: abi2 as any[],
          functionName: "value",
          chainId: polygonMumbai.id,
        },
      ],
      enabled: false,
    }
  );

  const { config: prepareContractWriteConfig } = usePrepareContractWrite({
    address: contractAddress2,
    abi: abi2,
    args: [12345],
    functionName: "setValue",
    chainId: polygonMumbai.id,
  });

  const { data: contractWrite, writeAsync } = useContractWrite(
    prepareContractWriteConfig
  );

  const { disconnect } = useDisconnect();

  const { data: ensAddress, refetch: refetchEnsAddress } = useEnsAddress({
    name: ensName,
    chainId: mainnet.id,
  });

  const { data: ensAvatar, refetch: refetchEnsAvatar } = useEnsAvatar({
    name: ensName,
    chainId: mainnet.id,
  });

  const { data: ensNameData, refetch: refetchEnsName } = useEnsName({
    address: ensAddress as Address,
    chainId: mainnet.id,
  });

  const { data: ensResolver, refetch: refetchEnsResolver } = useEnsResolver({
    name: ensName,
    chainId: mainnet.id,
  });

  const { data: feeData, refetch: refetchFeeData } = useFeeData();

  const {
    config: prepareSendTransactionConfig,
    error: prepareSendTransactionError,
  } = usePrepareSendTransaction({
    to: address,
    value: parseEther("0.0001"),
  });

  const { data: sendTransactionData, sendTransaction } = useSendTransaction(
    prepareSendTransactionConfig
  );

  const { data: signMessageData, signMessage } = useSignMessage({
    message: "gm wagmi frens",
  });

  const { data: signTypedDataData, signTypedData } = useSignTypedData({
    domain,
    message,
    primaryType: "Mail",
    types,
  });

  useEffect(() => {
    if (!isConnected) {
      setPKH("");
    }
  }, [isConnected]);

  if (isConnected)
    return (
      <div>
        <div>
          Connected to {address}
          <button onClick={() => disconnect()}>disconnect</button>
        </div>
        <div>
          pkh: {pkh}
          <button
            onClick={async () => {
              const pkh = await _dataverseConnector.runOS({
                method: SYSTEM_CALL.createCapability,
                params: {
                  appId: "4f500f45-e6cf-4f96-84cb-237a2a5e3604",
                  wallet: window.dataverse.wallet,
                },
              });
              setPKH(pkh);
            }}
          >
            createCapability
          </button>
        </div>

        <div>
          chain:{" "}
          {
            <RenderObjectRecursively
              object={{ id: chain?.id, name: chain?.name }}
              layout={Layout.horizontal}
            />
          }{" "}
          <button onClick={() => switchNetwork?.(polygonMumbai.id)}>
            switchNetwork
          </button>
          <button onClick={() => switchNetwork?.(mainnet.id)}>
            switchNetwork
          </button>
        </div>
        <div>
          balance: {balance?.formatted} {balance?.symbol}
          <button onClick={() => refetchBalance()}>refetch</button>
        </div>
        <div>
          Block number: {typeof blockNumber === "bigint" && Number(blockNumber)}
          <button onClick={() => refetchBlockNumber()}>refetch</button>
        </div>
        <div className="contract-read">
          Contract read:
          <span>
            {contractRead?.map((item, index) => {
              return (
                <div>
                  {index}:{" "}
                  {typeof item.result === "bigint" &&
                    Number((item as { result: bigint }).result)}
                </div>
              );
            })}
          </span>
          <button
            onClick={async () => {
              await switchNetworkAsync?.(polygonMumbai.id);
              const res = await refetchContractRead?.();
              console.log(res);
            }}
          >
            refetch
          </button>
        </div>
        <div>
          Contract write: {contractWrite?.hash}
          <button
            onClick={async () => {
              await switchNetworkAsync?.(polygonMumbai.id);
              const res = await writeAsync?.();
              console.log(res?.hash);
            }}
          >
            Excute
          </button>
        </div>
        <div>
          ENS Address: {ensAddress}
          <button onClick={() => refetchEnsAddress()}>refetch</button>
        </div>
        <div className="ens-avatar">
          ENS Avatar: {ensAvatar && <img src={ensAvatar} />}
          <button onClick={() => refetchEnsAvatar()}>refetch</button>
        </div>
        <div>
          ENS Name: {ensNameData}
          <button onClick={() => refetchEnsName()}>refetch</button>
        </div>
        <div>
          ENS Resolver: {ensResolver}
          <button onClick={() => refetchEnsResolver()}>refetch</button>
        </div>
        <div className="fee-data">
          <text>Fee Data:</text>
          <span>
            <div>{feeData && <RenderObjectRecursively object={feeData} />}</div>
            <button
              onClick={async () => {
                const res = await refetchFeeData();
                console.log(res);
              }}
            >
              refetch
            </button>
          </span>
        </div>
        <div>
          Send Transaction: {sendTransactionData?.hash}
          <button
            onClick={async () => {
              if (prepareSendTransactionError) {
                console.error(prepareSendTransactionError);
                return;
              }
              sendTransaction?.();
            }}
          >
            sendTransaction
          </button>
        </div>
        <div>
          Sign Message: {signMessageData}
          <button
            onClick={async () => {
              signMessage?.();
            }}
          >
            signMessage
          </button>
        </div>
        <div>
          Sign Typed Data: {signTypedDataData}
          <button
            onClick={async () => {
              await switchNetworkAsync?.(80001);
              signTypedData?.({ domain, message, primaryType: "Mail", types });
            }}
          >
            signTypedData
          </button>
        </div>
      </div>
    );
  return (
    <div>
      <button
        onClick={() =>
          connect({
            connector: dataverseConnector,
          })
        }
      >
        Connect Wallet
      </button>
    </div>
  );
}

export default Wagmi;
