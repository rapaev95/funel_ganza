'use client'

import { useTranslations } from 'next-intl'

export function InstagramMockup() {
  const t = useTranslations('instagram')

  return (
    <div className="instagram-mockup-container">
      <div className="phone-mockup">
        {/* Phone frame */}
        <div className="phone-frame">
          {/* Status bar */}
          <div className="phone-status-bar">
            <span className="status-time">09:41</span>
            <div className="status-icons">
              {/* Signal bars */}
              <div className="status-signal">
                <svg width="17" height="10" viewBox="0 0 17 10" fill="none">
                  <rect x="0" y="7" width="2.5" height="3" fill="#fff" opacity="0.4"/>
                  <rect x="3.5" y="5" width="2.5" height="5" fill="#fff" opacity="0.4"/>
                  <rect x="7" y="3" width="2.5" height="7" fill="#fff" opacity="0.4"/>
                  <rect x="10.5" y="1" width="2.5" height="9" fill="#fff"/>
                </svg>
              </div>
              {/* WiFi icon */}
              <div className="status-wifi">
                <svg width="15" height="11" viewBox="0 0 15 11" fill="none">
                  <path d="M7.5 0C4.05 0 0.97 1.5 0 3.75L7.5 11L15 3.75C14.03 1.5 10.95 0 7.5 0Z" fill="#fff"/>
                </svg>
              </div>
              {/* Battery icon */}
              <div className="status-battery">
                <svg width="24" height="12" viewBox="0 0 24 12" fill="none">
                  <rect x="0.5" y="2.5" width="18" height="7" rx="1.5" stroke="#fff" fill="none" strokeWidth="1"/>
                  <rect x="19" y="4.5" width="1.5" height="3" rx="0.5" fill="#fff"/>
                  <rect x="2" y="4" width="14" height="4" rx="0.5" fill="#fff"/>
                </svg>
                <span className="battery-percent">100</span>
              </div>
            </div>
          </div>

          {/* Instagram post */}
          <div className="instagram-post">
            {/* Post header */}
            <div className="post-header">
              <div className="post-avatar">
                <img 
                  src="/foto/avatar.png" 
                  alt="Profile avatar"
                  className="avatar-circle"
                  onError={(e) => {
                    e.currentTarget.style.display = 'none'
                  }}
                />
              </div>
              <div className="post-user-info">
                <div className="post-username">anna_trox21</div>
                <div className="post-location">{t('location')}</div>
              </div>
              <div className="post-more">⋯</div>
            </div>

            {/* Post image */}
            <div className="post-image">
              <img 
                src="/foto/insta.jpg" 
                alt="Instagram post"
                className="post-image-content"
                onError={(e) => {
                  e.currentTarget.style.display = 'none'
                }}
              />
            </div>

            {/* Post actions */}
            <div className="post-actions">
              <div className="post-action-left">
                <button className="post-action-btn liked">
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/>
                  </svg>
                </button>
                <button className="post-action-btn">
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/>
                  </svg>
                </button>
                <button className="post-action-btn">
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M4 12v8a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-8"/>
                    <polyline points="16 6 12 2 8 6"/>
                    <line x1="12" y1="2" x2="12" y2="15"/>
                  </svg>
                </button>
              </div>
              <button className="post-action-btn">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/>
                </svg>
              </button>
            </div>

            {/* Post likes */}
            <div className="post-likes">
              <strong>12.5K</strong> {t('likes')}
            </div>

            {/* Post caption */}
            <div className="post-caption">
              <strong>anna_trox21</strong> {t('caption')}
            </div>

            {/* Post comments */}
            <div className="post-comments">
              <div className="post-comment">
                <strong>masha_fashion</strong> {t('comment1')}
              </div>
              <div className="post-comment">
                <strong>katya_looks</strong> {t('comment2')}
              </div>
              <div className="post-comment">
                <strong>liza_style</strong> {t('comment3')}
              </div>
            </div>

            {/* Post time */}
            <div className="post-time">{t('timeAgo')}</div>
          </div>
        </div>
      </div>
    </div>
  )
}

