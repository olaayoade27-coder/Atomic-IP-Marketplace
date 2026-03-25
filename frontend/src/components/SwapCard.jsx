import React from "react";
import { CancelSwapButton } from "./CancelSwapButton";
import { ConfirmSwapForm } from "./ConfirmSwapForm";
import "./SwapCard.css";

/**
 * SwapCard
 *
 * Renders the appropriate action UI based on the connected wallet's role:
 *   - Buyer  → CancelSwapButton (countdown or cancel)
 *   - Seller → ConfirmSwapForm  (submit decryption key)
 *
 * Props:
 *   swap            - full swap object { id, listing_id, buyer, seller,
 *                     usdc_amount, status, expires_at, ... }
 *   ledgerTimestamp - current ledger timestamp (unix seconds, u64)
 *   wallet          - connected wallet { address, signTransaction }
 *   onSwapUpdated   - callback to refresh swap data
 */
export function SwapCard({ swap, ledgerTimestamp, wallet, onSwapUpdated }) {
  const isBuyer = wallet?.address === swap.buyer;
  const isSeller = wallet?.address === swap.seller;

  return (
    <div className="swap-card">
      <div className="swap-card__info">
        <span className="swap-card__id">Swap #{swap.id}</span>
        <span className="swap-card__status" data-status={swap.status}>
          {swap.status}
        </span>
        <span className="swap-card__amount">{swap.usdc_amount} USDC</span>
      </div>

      {isBuyer && (
        <CancelSwapButton
          swap={swap}
          ledgerTimestamp={ledgerTimestamp}
          wallet={wallet}
          onSuccess={onSwapUpdated}
        />
      )}

      {isSeller && (
        <ConfirmSwapForm
          swap={swap}
          wallet={wallet}
          onSuccess={onSwapUpdated}
        />
      )}
    </div>
  );
}
