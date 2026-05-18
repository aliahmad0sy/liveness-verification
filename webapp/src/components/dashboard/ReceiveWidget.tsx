"use client";

import { useState } from "react";
import { Copy, Share2, QrCode, CheckCircle, Info, Network } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { CURRENCIES } from "@/lib/constants";
import { cn } from "@/lib/utils/cn";

const WALLET_ID = "KW-USER-ABC123";

const CRYPTO_ADDRESSES: Record<string, { address: string; network: string; networkLabel: string }[]> = {
  USDT: [
    { address: "TRx9kH2mVp3NqL8wYbD4cJfE7aG1sK5uX", network: "TRC20", networkLabel: "شبكة ترون (TRC20)" },
    { address: "0x3A8f9b2C5d6E1F4a7B0c8D2e5F3a6B9c2D4e1F", network: "ERC20", networkLabel: "شبكة إيثيريوم (ERC20)" },
    { address: "0x3A8f9b2C5d6E1F4a7B0c8D2e5F3a6B9c2D4e1F", network: "BEP20", networkLabel: "شبكة بينانس (BEP20)" },
  ],
  BTC: [
    { address: "bc1qxy2kgdygjrsqtzq2n0yrf2493p83kkfjhx0wlh", network: "Bitcoin", networkLabel: "شبكة بيتكوين" },
  ],
  ETH: [
    { address: "0x3A8f9b2C5d6E1F4a7B0c8D2e5F3a6B9c2D4e1F", network: "ERC20", networkLabel: "شبكة إيثيريوم (ERC20)" },
  ],
  LTC: [
    { address: "LTCx9kH2mVp3NqL8wYbD4cJfE7aG1sK5uX", network: "Litecoin", networkLabel: "شبكة لايتكوين" },
  ],
  TRX: [
    { address: "TRx9kH2mVp3NqL8wYbD4cJfE7aG1sK5uX", network: "TRC20", networkLabel: "شبكة ترون (TRC20)" },
  ],
  BNB: [
    { address: "bnb1grpf0955h0ykzq3ar5nmum7y6gdfl6lxfn46h2", network: "BEP2", networkLabel: "شبكة بينانس (BEP2)" },
  ],
  SOL: [
    { address: "HN7cABqLq46Es1jh92dQQisAq662SmxELLLsHHe4YWrH", network: "Solana", networkLabel: "شبكة سولانا" },
  ],
  USDC: [
    { address: "0x3A8f9b2C5d6E1F4a7B0c8D2e5F3a6B9c2D4e1F", network: "ERC20", networkLabel: "شبكة إيثيريوم (ERC20)" },
  ],
};

const FIAT_CURRENCIES = CURRENCIES.filter((c) => c.type === "FIAT");
const CRYPTO_CURRENCIES = CURRENCIES.filter((c) => c.type === "CRYPTO");
const EBANK_CURRENCIES = CURRENCIES.filter((c) => c.type === "EBANK");

const TAB_GROUPS = [
  { label: "معرّف المحفظة", key: "wallet" },
  { label: "العملات المشفرة", key: "crypto" },
  { label: "العملات الورقية", key: "fiat" },
];

export function ReceiveWidget() {
  const [activeTab, setActiveTab] = useState<"wallet" | "crypto" | "fiat">("wallet");
  const [selectedCrypto, setSelectedCrypto] = useState("USDT");
  const [selectedNetwork, setSelectedNetwork] = useState(0);
  const [copied, setCopied] = useState(false);

  const cryptoNetworks = CRYPTO_ADDRESSES[selectedCrypto] ?? [];
  const currentNetwork = cryptoNetworks[selectedNetwork];
  const displayAddress = activeTab === "crypto" && currentNetwork ? currentNetwork.address : WALLET_ID;

  function handleCopy() {
    navigator.clipboard.writeText(displayAddress).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  }

  function handleShare() {
    if (navigator.share) {
      navigator.share({
        title: "KazaWallet — عنوان الاستلام",
        text: `أرسل لي على KazaWallet: ${displayAddress}`,
      });
    } else {
      handleCopy();
    }
  }

  return (
    <div className="max-w-md mx-auto space-y-4">
      {/* Tab selector */}
      <div className="flex bg-white/5 border border-white/10 rounded-xl p-1 gap-1">
        {TAB_GROUPS.map((tab) => (
          <button
            key={tab.key}
            onClick={() => setActiveTab(tab.key as typeof activeTab)}
            className={cn(
              "flex-1 py-2 px-3 rounded-lg text-xs font-semibold transition-all duration-200",
              activeTab === tab.key
                ? "bg-blue-600 text-white shadow-lg shadow-blue-500/20"
                : "text-slate-400 hover:text-white hover:bg-white/5"
            )}
          >
            {tab.label}
          </button>
        ))}
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-base flex items-center gap-2">
            <QrCode className="w-5 h-5 text-blue-400" />
            {activeTab === "wallet" && "معرّف المحفظة"}
            {activeTab === "crypto" && "عنوان الإيداع"}
            {activeTab === "fiat" && "استقبال العملات الورقية"}
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-5">

          {/* Crypto network selector */}
          {activeTab === "crypto" && (
            <div className="space-y-3">
              <div className="w-full">
                <label className="block text-sm font-medium text-slate-300 mb-1.5">العملة</label>
                <select
                  value={selectedCrypto}
                  onChange={(e) => {
                    setSelectedCrypto(e.target.value);
                    setSelectedNetwork(0);
                  }}
                  className="flex h-11 w-full rounded-xl border border-white/10 bg-white/5 px-4 text-sm text-white outline-none focus:ring-2 focus:ring-blue-500/50"
                >
                  {CRYPTO_CURRENCIES.map((c) => (
                    <option key={c.code} value={c.code} className="bg-[#1a2035]">
                      {c.emoji} {c.code} — {c.nameAr}
                    </option>
                  ))}
                </select>
              </div>

              {cryptoNetworks.length > 1 && (
                <div className="w-full">
                  <label className="block text-sm font-medium text-slate-300 mb-1.5">الشبكة</label>
                  <div className="flex gap-2 flex-wrap">
                    {cryptoNetworks.map((n, i) => (
                      <button
                        key={n.network}
                        onClick={() => setSelectedNetwork(i)}
                        className={cn(
                          "flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold border transition-all",
                          selectedNetwork === i
                            ? "bg-blue-600/20 border-blue-500/40 text-blue-300"
                            : "bg-white/5 border-white/10 text-slate-400 hover:text-white hover:bg-white/10"
                        )}
                      >
                        <Network className="w-3 h-3" />
                        {n.network}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {currentNetwork && (
                <div className="bg-amber-500/10 border border-amber-500/20 rounded-xl px-4 py-3 flex items-start gap-2">
                  <Info className="w-4 h-4 text-amber-400 flex-shrink-0 mt-0.5" />
                  <p className="text-xs text-amber-300">
                    تأكد من استخدام <span className="font-bold">{currentNetwork.networkLabel}</span> عند الإيداع. الإيداع على شبكة خاطئة قد يؤدي إلى فقدان الأموال.
                  </p>
                </div>
              )}
            </div>
          )}

          {/* Fiat currency list */}
          {activeTab === "fiat" && (
            <div className="space-y-2">
              {[...FIAT_CURRENCIES, ...EBANK_CURRENCIES].map((c) => (
                <div
                  key={c.code}
                  className="flex items-center justify-between bg-white/5 border border-white/10 rounded-xl px-4 py-3"
                >
                  <div className="flex items-center gap-3">
                    <span className="text-2xl">{c.emoji}</span>
                    <div>
                      <div className="text-sm font-semibold text-white">{c.code}</div>
                      <div className="text-xs text-slate-400">{c.nameAr}</div>
                    </div>
                  </div>
                  <Badge variant="secondary">{c.type === "EBANK" ? "إلكترونية" : "ورقية"}</Badge>
                </div>
              ))}
              <div className="bg-blue-500/5 border border-blue-500/15 rounded-xl px-4 py-3 text-xs text-blue-300">
                <Info className="w-3.5 h-3.5 inline ml-1.5" />
                شارك معرّف محفظتك <span className="font-bold text-white">{WALLET_ID}</span> مع المُرسِل لاستقبال العملات الورقية والإلكترونية.
              </div>
            </div>
          )}

          {/* QR Code placeholder */}
          {activeTab !== "fiat" && (
            <div className="flex flex-col items-center gap-3">
              <div className="w-48 h-48 border-2 border-dashed border-white/20 rounded-2xl flex flex-col items-center justify-center gap-2 bg-white/3">
                <QrCode className="w-16 h-16 text-slate-500" />
                <span className="text-xs text-slate-500">رمز QR</span>
              </div>
              <p className="text-xs text-slate-500">امسح رمز QR لاستلام الأموال</p>
            </div>
          )}

          {/* Address display */}
          {activeTab !== "fiat" && (
            <div className="space-y-2">
              <label className="block text-sm font-medium text-slate-300">
                {activeTab === "wallet" ? "معرّف محفظتك" : "عنوان الإيداع"}
              </label>
              <div className="flex items-center gap-2 bg-white/5 border border-white/10 rounded-xl px-4 py-3">
                <span className="flex-1 text-sm font-mono text-white break-all" dir="ltr">
                  {displayAddress}
                </span>
              </div>
            </div>
          )}

          {/* Instructions */}
          {activeTab === "wallet" && (
            <div className="bg-blue-500/5 border border-blue-500/15 rounded-xl px-4 py-3 text-xs text-blue-300 flex items-start gap-2">
              <Info className="w-3.5 h-3.5 mt-0.5 flex-shrink-0" />
              <span>شارك معرّفك مع المُرسِل ليتمكن من تحويل الأموال إليك مباشرةً عبر منصة KazaWallet</span>
            </div>
          )}

          {/* Action buttons */}
          {activeTab !== "fiat" && (
            <div className="flex gap-3">
              <Button
                variant="secondary"
                className="flex-1 gap-2"
                onClick={handleCopy}
              >
                {copied ? (
                  <>
                    <CheckCircle className="w-4 h-4 text-emerald-400" />
                    <span className="text-emerald-400">تم النسخ!</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-4 h-4" />
                    نسخ العنوان
                  </>
                )}
              </Button>
              <Button variant="secondary" className="flex-1 gap-2" onClick={handleShare}>
                <Share2 className="w-4 h-4" />
                مشاركة
              </Button>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Minimum deposit notice */}
      {activeTab === "crypto" && (
        <div className="bg-white/3 border border-white/8 rounded-xl px-4 py-3 space-y-1.5">
          <p className="text-xs font-semibold text-slate-300">تعليمات الإيداع</p>
          <ul className="text-xs text-slate-400 space-y-1 list-disc list-inside">
            <li>الحد الأدنى للإيداع: 10 {selectedCrypto}</li>
            <li>يُضاف الرصيد بعد 3 تأكيدات على الشبكة</li>
            <li>رسوم الإيداع: مجانية</li>
          </ul>
        </div>
      )}
    </div>
  );
}
